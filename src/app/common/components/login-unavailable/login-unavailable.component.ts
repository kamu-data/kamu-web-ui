/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import AppValues from "@common/values/app.values";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-login-unavailable",
    templateUrl: "./login-unavailable.component.html",
    styleUrls: ["./login-unavailable.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginUnavailableComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    private appConfigService = inject(AppConfigService);

    public get supportEmail(): MaybeUndefined<string> {
        return this.appConfigService.supportEmail;
    }
}
