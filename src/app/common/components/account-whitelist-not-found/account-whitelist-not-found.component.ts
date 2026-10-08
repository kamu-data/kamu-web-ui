/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import AppValues from "@common/values/app.values";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-whitelist-not-found",
    imports: [NgIf, MatIconModule],
    templateUrl: "./account-whitelist-not-found.component.html",
    styleUrls: ["./account-whitelist-not-found.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWhitelistNotFoundComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    public readonly supportEmail: MaybeUndefined<string> = inject(AppConfigService).supportEmail;

    private navigationService = inject(NavigationService);

    public navigateToLogin(): void {
        this.navigationService.navigateToLogin();
    }
}
