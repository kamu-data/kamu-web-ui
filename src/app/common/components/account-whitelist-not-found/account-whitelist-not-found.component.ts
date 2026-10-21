/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { ErrorPageLayoutComponent } from "@common/components/error-page-layout/error-page-layout.component";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-whitelist-not-found",
    templateUrl: "./account-whitelist-not-found.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ErrorPageLayoutComponent,
    ],
})
export class AccountWhitelistNotFoundComponent {
    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);

    public get supportEmail(): MaybeUndefined<string> {
        return this.appConfigService.supportEmail;
    }

    public navigateToLogin(): void {
        this.navigationService.navigateToLogin();
    }
}
