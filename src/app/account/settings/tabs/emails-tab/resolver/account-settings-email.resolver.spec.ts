/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { accountSettingsEmailResolverFn } from "./account-settings-email.resolver";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("accountSettingsEmailResolverFn", () => {
    let accountEmailService: AccountEmailService;
    let loggedUserService: LoggedUserService;
    let router: Router;

    const executeResolver: ResolveFn<AccountWithEmailFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsEmailResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [Apollo, provideAnimations(), provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
