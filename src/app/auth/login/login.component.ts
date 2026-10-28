/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Observable, shareReplay } from "rxjs";

import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { BaseComponent } from "@common/components/base.component";
import { SpinnerComponent } from "@common/components/spinner/spinner/spinner.component";
import { inAppPathFromParam, isUuid } from "@common/helpers/url-params.helpers";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import AppValues from "@common/values/app.values";
import { ErrorTexts } from "@common/values/errors.text";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { LoginFormType } from "src/app/auth/login/login.component.model";
import { LoginService } from "src/app/auth/login/login.service";
import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgTemplateOutlet,
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        //-----//
        MatIconModule,
        //-----//
        FormValidationErrorsDirective,
        SpinnerComponent,
    ],
})
export class LoginComponent extends BaseComponent implements OnInit {
    public static readonly ERROR_ZERO_METHODS_IN_CONFIG =
        "LoginComponent requires at least 1 login method in configuration";

    private localStorageService = inject(LocalStorageService);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private loginService = inject(LoginService);
    private loginMethodsService = inject(LoginMethodsService);
    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);
    private cdr = inject(ChangeDetectorRef);
    private redirectUrl: MaybeNull<string>;

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    public readonly AccountProvider = AccountProvider;
    public readonly ERROR_INVALID_DEVICE_CODE = ErrorTexts.ERROR_INVALID_DEVICE_CODE;
    public invalidDeviceCode = false;

    public selectedLoginMethod?: AccountProvider = undefined;
    public passwordLoginForm: FormGroup<LoginFormType> = this.fb.nonNullable.group({
        login: ["", [Validators.required]],
        password: ["", [Validators.required]],
    });
    public passwordLoginError$: Observable<string> =
        this.loginService.passwordLoginErrorOccurrences.pipe(shareReplay());

    public ngOnInit(): void {
        this.redirectUrl =
            inAppPathFromParam(this.route.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL)) ??
            null;
        if (this.redirectUrl && this.localStorageService.accessToken) {
            this.navigationService.navigateToReplacedPath(this.redirectUrl);
        } else {
            const loginMethods: AccountProvider[] = this.loginMethodsService.loginMethods;
            if (loginMethods.length === 1) {
                this.onSelectedLoginMethod(loginMethods[0]);
            } else if (loginMethods.length === 0) {
                throw new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG);
            }

            this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParamMap: ParamMap) => {
                const deviceCode = queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_DEVICE_CODE);
                // A device code the API would refuse is not kept, so signing in still works for the web UI
                this.invalidDeviceCode = deviceCode !== null && !isUuid(deviceCode);
                this.localStorageService.setDeviceCode(this.invalidDeviceCode ? null : deviceCode);
                this.cdr.markForCheck();
            });
        }
    }

    public get enableTermsOfService(): boolean {
        return this.appConfigService.featureFlags.enableTermsOfService;
    }

    public onSelectedLoginMethod(loginMethod: AccountProvider): void {
        this.selectedLoginMethod = loginMethod;
        if (loginMethod === AccountProvider.OauthGithub) {
            this.loginService.gotoGithub(this.redirectUrl);
        }
    }

    public async onWeb3WalletLogin(): Promise<void> {
        await this.loginService.web3WalletLogin(this.redirectUrl);
    }

    public onPasswordLogin(): void {
        if (this.passwordLoginForm.invalid) {
            this.passwordLoginForm.markAllAsTouched();
            return;
        }
        // The field trims on blur, and Enter in the field submits without one.
        const { login, password } = this.passwordLoginForm.getRawValue();
        this.loginService.passwordLogin({ login: login.trim(), password }, this.redirectUrl);
    }

    public resetPasswordLoginError(): void {
        this.loginService.resetPasswordLoginError();
    }

    public onChangeInputField(event: KeyboardEvent): void {
        if (event.key !== "Enter") {
            this.resetPasswordLoginError();
        }
    }
}
