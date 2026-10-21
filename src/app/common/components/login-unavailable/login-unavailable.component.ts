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
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { NavigationService } from "src/app/services/navigation.service";

import { LoginUnavailableTexts } from "./login-unavailable.text";

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
    public readonly TEXTS = LoginUnavailableTexts;

    private appConfigService = inject(AppConfigService);
    private loginMethodsService = inject(LoginMethodsService);
    private navigationService = inject(NavigationService);

    public get supportEmail(): MaybeUndefined<string> {
        return this.appConfigService.supportEmail;
    }

    public get loadFailed(): boolean {
        return this.loginMethodsService.loadFailed;
    }

    // The methods are loaded only at startup, so trying again means starting the app anew
    public tryAgain(): void {
        this.navigationService.reloadPage();
    }
}
