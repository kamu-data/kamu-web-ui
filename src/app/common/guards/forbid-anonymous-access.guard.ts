/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

export const forbidAnonymousAccessGuardFn: CanActivateFn = () => {
    const loggedUserService = inject(LoggedUserService);
    const navigationService = inject(NavigationService);

    const loggedUser = loggedUserService.maybeCurrentlyLoggedInUser;
    if (loggedUser) {
        return true;
    } else {
        navigationService.navigateToLogin();
        return false;
    }
};
