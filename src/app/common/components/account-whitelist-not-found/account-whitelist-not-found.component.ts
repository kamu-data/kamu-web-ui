/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import AppValues from "@common/values/app.values";

import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-whitelist-not-found",
    imports: [MatIconModule],
    templateUrl: "./account-whitelist-not-found.component.html",
    styleUrls: ["./account-whitelist-not-found.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWhitelistNotFoundComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    private navigationService = inject(NavigationService);

    public navigateToLogin(): void {
        this.navigationService.navigateToLogin();
    }
}
