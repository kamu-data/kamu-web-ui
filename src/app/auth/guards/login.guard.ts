/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "src/app/services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { LoggedUserService } from "../logged-user.service";
import { LoginService } from "../login/login.service";

@Injectable({
    providedIn: "root",
})
export class LoginGuard {
    private navigationService = inject(NavigationService);
    private loginService = inject(LoginService);
    private loggedUserService = inject(LoggedUserService);

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // URLs start from /
        if (state.url.slice(1) === ProjectLinks.URL_LOGIN && !this.canLogin()) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }

    private canLogin(): boolean {
        return this.loginService.loginMethods.length > 0 && !this.loggedUserService.isAuthenticated;
    }
}
