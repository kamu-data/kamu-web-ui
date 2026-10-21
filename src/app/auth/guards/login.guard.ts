/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { NavigationService } from "src/app/services/navigation.service";

export const loginGuard: CanActivateFn = () => {
    const appConfigService = inject(AppConfigService);
    const loginMethodsService = inject(LoginMethodsService);
    const loggedUserService = inject(LoggedUserService);
    const navigationService = inject(NavigationService);

    if (loggedUserService.isAuthenticated) {
        return navigationService.homeUrlTree();
    }
    if (loginMethodsService.loginMethods.length > 0) {
        return true;
    }
    // Home is behind the anonymous-access guard when anonymous access is forbidden, so it would send the user back here
    return appConfigService.allowAnonymous
        ? navigationService.homeUrlTree()
        : navigationService.loginUnavailableUrlTree();
};
