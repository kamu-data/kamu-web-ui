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

@Component({
    selector: "app-login-unavailable",
    templateUrl: "./login-unavailable.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ErrorPageLayoutComponent,
    ],
})
export class LoginUnavailableComponent {
    private appConfigService = inject(AppConfigService);

    public get supportEmail(): MaybeUndefined<string> {
        return this.appConfigService.supportEmail;
    }
}
