/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { NavigationService } from "src/app/services/navigation.service";

export const forbidAnonymousAccessGuardFn: CanActivateFn = (_route, state) => {
    const loggedUserService = inject(LoggedUserService);
    const loginMethodsService = inject(LoginMethodsService);
    const navigationService = inject(NavigationService);

    if (loggedUserService.maybeCurrentlyLoggedInUser) {
        return true;
    }
    return loginMethodsService.loginMethods.length > 0
        ? navigationService.loginUrlTree(state.url)
        : navigationService.loginUnavailableUrlTree();
};
