/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuard {
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);

    public canActivate(): boolean {
        if (!this.isAdmin()) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }

    private isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }
}
