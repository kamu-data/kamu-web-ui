/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

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

    it("should check fetch account with success", () => {
        const fetchAccountWithEmailSpy = vi
            .spyOn(accountApi, "fetchAccountWithEmail")
            .mockReturnValue(of(mockAccountWithEmailQuery));
        service.fetchAccountWithEmail(TEST_ACCOUNT_EMAIL).subscribe(() => {
            expect(fetchAccountWithEmailSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should change the account email and report it", async () => {
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");
        const changeAccountEmailSpy = vi
            .spyOn(accountApi, "changeAccountEmail")
            .mockReturnValue(of(mockAccountChangeEmailMutationSuccess));

        const result = await firstValueFrom(
            service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }),
        );

        expect(result).toEqual({ ok: true, value: true });
        expect(changeAccountEmailSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            newEmail: TEST_ACCOUNT_EMAIL,
        });
        expect(toastrServiceSuccessSpy).toHaveBeenCalledWith(
            mockAccountChangeEmailMutationSuccess.accounts.byName?.updateEmail.message,
        );
    });

    it("should return an email another account uses as the email field's error, without a toast", async () => {
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");
        vi.spyOn(accountApi, "changeAccountEmail").mockReturnValue(of(mockAccountChangeEmailMutationError));

        const result = await firstValueFrom(
            service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }),
        );

        expect(result).toEqual({ ok: false, fieldError: MOCK_CHANGE_EMAIL_NON_UNIQUE_MESSAGE });
        expect(toastrServiceErrorSpy).not.toHaveBeenCalled();
    });
});
