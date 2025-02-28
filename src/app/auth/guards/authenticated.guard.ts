/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "src/app/services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticatedGuard {
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);

    public canActivate(): boolean {
        if (!this.loggedUserService.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
