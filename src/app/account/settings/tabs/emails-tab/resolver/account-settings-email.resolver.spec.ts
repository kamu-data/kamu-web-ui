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
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";

import { accountSettingsEmailResolverFn } from "./account-settings-email.resolver";

describe("accountSettingsEmailResolverFn", () => {
    let accountEmailService: AccountEmailService;
    let loggedUserService: LoggedUserService;
    let router: Router;

    const executeResolver: ResolveFn<AccountWithEmailFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsEmailResolverFn(...resolverParameters));

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

        accountEmailService = TestBed.inject(AccountEmailService);
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const fetchAccountWithEmailSpy = spyOn(accountEmailService, "fetchAccountWithEmail");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        await executeResolver(routeSnapshot, router.routerState.snapshot);

        expect(fetchAccountWithEmailSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
    });
});
