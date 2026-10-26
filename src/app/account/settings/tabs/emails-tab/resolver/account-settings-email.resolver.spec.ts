/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails, mockAccountDetailsWithEmail } from "@api/mock/auth.mock";

import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { accountSettingsEmailResolverFn } from "src/app/account/settings/tabs/emails-tab/resolver/account-settings-email.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountSettingsEmailResolverFn", () => {
    let accountEmailService: AccountEmailService;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });

        accountEmailService = TestBed.inject(AccountEmailService);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should check resolver", async () => {
        const fetchAccountWithEmailSpy = vi
            .spyOn(accountEmailService, "fetchAccountWithEmail")
            .mockReturnValue(of(mockAccountDetailsWithEmail));
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const result = await runResolver(accountSettingsEmailResolverFn);

        expect(fetchAccountWithEmailSpy).toHaveBeenCalledTimes(1);

        expect(fetchAccountWithEmailSpy).toHaveBeenCalledWith(mockAccountDetails.accountName);
        expect(result).toEqual(mockAccountDetailsWithEmail);
    });
});
