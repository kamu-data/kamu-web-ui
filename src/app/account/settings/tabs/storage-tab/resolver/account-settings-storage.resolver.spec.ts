/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { mockAccountDetails } from "@api/mock/auth.mock";

import { AccountStorageQuotaService } from "src/app/account/settings/tabs/storage-tab/account-storage-quota.service";
import { accountSettingsStorageResolverFn } from "src/app/account/settings/tabs/storage-tab/resolver/account-settings-storage.resolver";
import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountSettingsStorageResolverFn", () => {
    let accountStorageQuotaService: AccountStorageQuotaService;
    let loggedUserService: LoggedUserService;
    let router: Router;

    const executeResolver: ResolveFn<AccountStorageQuota> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsStorageResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Apollo,
                provideAnimations(),
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        accountStorageQuotaService = TestBed.inject(AccountStorageQuotaService);
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const fetchStorageQuotaSpy = spyOn(accountStorageQuotaService, "fetchStorageQuota");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        await executeResolver(routeSnapshot, router.routerState.snapshot);

        expect(fetchStorageQuotaSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
    });
});
