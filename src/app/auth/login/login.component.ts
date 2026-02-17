/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Params } from "@angular/router";

import { Observable, shareReplay } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import AppValues from "@common/values/app.values";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { AppConfigService } from "src/app/app-config.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

import { SpinnerComponent } from "../../common/components/spinner/spinner/spinner.component";
import { FormValidationErrorsDirective } from "../../common/directives/form-validation-errors.directive";
import { LoginMethodsService } from "../login-methods.service";
import { AccountProvider } from "./../../api/kamu.graphql.interface";
import { LoginFormType } from "./login.component.model";
import { LoginService } from "./login.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
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
    private redirectUrl: MaybeNull<string>;

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    public readonly AccountProvider = AccountProvider;

    public selectedLoginMethod?: AccountProvider = undefined;
    public passwordLoginForm: FormGroup<LoginFormType> = this.fb.group({
        login: ["", [Validators.required]],
        password: ["", [Validators.required]],
    });
    public passwordLoginError$: Observable<string> =
        this.loginService.passwordLoginErrorOccurrences.pipe(shareReplay());

    public ngOnInit(): void {
        this.redirectUrl = this.route.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL);
        if (this.redirectUrl && this.localStorageService.accessToken) {
            this.navigationService.navigateToReplacedPath(this.redirectUrl);
        } else {
            const loginMethods: AccountProvider[] = this.loginMethodsService.loginMethods;
            if (loginMethods.length === 1) {
                this.onSelectedLoginMethod(loginMethods[0]);
            } else if (loginMethods.length === 0) {
                throw new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG);
            }

            this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams: Params) => {
                const deviceCode: MaybeUndefined<string> = queryParams[
                    ProjectLinks.URL_QUERY_PARAM_DEVICE_CODE
                ] as MaybeUndefined<string>;
                this.localStorageService.setDeviceCode(deviceCode ?? null);
            });
        }
    }

    public get loginControl(): MaybeNull<AbstractControl> {
        return this.passwordLoginForm.get("login");
    }

    public get passwordControl(): MaybeNull<AbstractControl> {
        return this.passwordLoginForm.get("password");
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
        this.loginService.passwordLogin(this.passwordLoginForm.value as PasswordLoginCredentials, this.redirectUrl);
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
