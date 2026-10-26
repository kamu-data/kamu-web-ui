/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { AccountApi } from "@api/account.api";
import {
    MOCK_CHANGE_EMAIL_NON_UNIQUE_MESSAGE,
    mockAccountChangeEmailMutationError,
    mockAccountChangeEmailMutationSuccess,
    mockAccountWithEmailQuery,
} from "@api/mock/account.mock";
import { TEST_ACCOUNT_EMAIL } from "@api/mock/auth.mock";
import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";

describe("AccountEmailService", () => {
    let service: AccountEmailService;
    let accountApi: AccountApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        accountApi = TestBed.inject(AccountApi);
        toastrService = TestBed.inject(ToastrService);
        service = TestBed.inject(AccountEmailService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check reset rename account error", () => {
        const emitRenameAccountEmailErrorOccurredSpy = vi
            .spyOn(service, "emitRenameAccountEmailErrorOccurred")
            .mockImplementation(() => {});
        service.resetChangeEmailError();
        expect(emitRenameAccountEmailErrorOccurredSpy).toHaveBeenCalledWith("");
    });

    it("should check fetch account with success", () => {
        const fetchAccountWithEmailSpy = vi
            .spyOn(accountApi, "fetchAccountWithEmail")
            .mockReturnValue(of(mockAccountWithEmailQuery));
        service.fetchAccountWithEmail(TEST_ACCOUNT_EMAIL).subscribe(() => {
            expect(fetchAccountWithEmailSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check change account email with success", () => {
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");
        const changeAccountEmailSpy = vi
            .spyOn(accountApi, "changeAccountEmail")
            .mockReturnValue(of(mockAccountChangeEmailMutationSuccess));
        service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }).subscribe(() => {
            expect(changeAccountEmailSpy).toHaveBeenCalledTimes(1);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith(
                mockAccountChangeEmailMutationSuccess.accounts.byName?.updateEmail.message,
            );
        });
    });

    it("should check change account email with error", () => {
        const emitRenameAccountEmailErrorOccurredSpy = vi
            .spyOn(service, "emitRenameAccountEmailErrorOccurred")
            .mockImplementation(() => {});
        const changeAccountEmailSpy = vi
            .spyOn(accountApi, "changeAccountEmail")
            .mockReturnValue(of(mockAccountChangeEmailMutationError));
        service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }).subscribe(() => {
            expect(changeAccountEmailSpy).toHaveBeenCalledTimes(1);
            expect(emitRenameAccountEmailErrorOccurredSpy).toHaveBeenCalledWith(MOCK_CHANGE_EMAIL_NON_UNIQUE_MESSAGE);
        });
    });
});
