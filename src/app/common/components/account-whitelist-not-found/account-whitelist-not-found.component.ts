/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import AppValues from "../../values/app.values";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-account-whitelist-not-found",
    imports: [MatIconModule],
    templateUrl: "./account-whitelist-not-found.component.html",
    styleUrls: ["./account-whitelist-not-found.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountWhitelistNotFoundComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    private navigationService = inject(NavigationService);

    public navigateToLogin(): void {
        this.navigationService.navigateToLogin();
    }
}
