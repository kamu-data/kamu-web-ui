/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { isAccessTokenExpired } from "@common/helpers/app.helpers";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

export const accessTokenExpiredGuardFn: CanActivateFn = (_, state) => {
    const localStorageService = inject(LocalStorageService);
    const navigationService = inject(NavigationService);

    const accessToken: string | null = localStorageService.accessToken;
    if (accessToken && isAccessTokenExpired(accessToken)) {
        navigationService.navigateToLogin(state.url);
        return false;
    }
    return true;
};
