/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import AppValues from "src/app/common/values/app.values";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);

    public navigateToHome(): void {
        this.navigationService.navigateToHome();
    }

    public navigateToLogin(): void {
        this.navigationService.navigateToLogin();
    }

    public get isAuthenticated(): boolean {
        return this.loggedUserService.isAuthenticated;
    }
}
