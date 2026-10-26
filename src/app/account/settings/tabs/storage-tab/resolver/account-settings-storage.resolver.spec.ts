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
import { mockAccountDetails } from "@api/mock/auth.mock";

import { AccountStorageQuotaService } from "src/app/account/settings/tabs/storage-tab/account-storage-quota.service";
import { accountSettingsStorageResolverFn } from "src/app/account/settings/tabs/storage-tab/resolver/account-settings-storage.resolver";
import { mockStorageQuotaWithinLimit } from "src/app/account/settings/tabs/storage-tab/storage-tab.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountSettingsStorageResolverFn", () => {
    let accountStorageQuotaService: AccountStorageQuotaService;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });

        accountStorageQuotaService = TestBed.inject(AccountStorageQuotaService);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should check resolver", async () => {
        const fetchStorageQuotaSpy = spyOn(accountStorageQuotaService, "fetchStorageQuota").and.returnValue(
            of(mockStorageQuotaWithinLimit),
        );
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const result = await runResolver(accountSettingsStorageResolverFn);

        expect(fetchStorageQuotaSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
        expect(result).toEqual(mockStorageQuotaWithinLimit);
    });
});
