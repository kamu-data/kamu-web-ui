/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import ProjectLinks from "src/app/project-links";
import AppValues from "src/app/common/values/app.values";
import { LoginService } from "./login.service";
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { Observable, shareReplay } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { BaseComponent } from "src/app/common/components/base.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { LoginFormType } from "./login.component.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AppConfigService } from "src/app/app-config.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountProvider } from "./../../api/kamu.graphql.interface";
import { FormValidationErrorsDirective } from "../../common/directives/form-validation-errors.directive";
import { SpinnerComponent } from "../../common/components/spinner/spinner/spinner.component";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, NgTemplateOutlet, AsyncPipe } from "@angular/common";
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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
    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);

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
        const redirectUrl = this.route.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL);
        if (redirectUrl && this.localStorageService.accessToken) {
            this.navigationService.navigateToReplacedPath(redirectUrl);
        } else if (redirectUrl) {
            this.localStorageService.setRedirectAfterLoginUrl(redirectUrl);
            this.navigationService.navigateToReplacedPath(ProjectLinks.URL_LOGIN);
        } else {
            const loginMethods: AccountProvider[] = this.loginService.loginMethods;
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
            this.loginService.gotoGithub();
        }
    }

    public async onWeb3WalletLogin(): Promise<void> {
        await this.loginService.web3WalletLogin();
    }

    public onPasswordLogin(): void {
        this.loginService.passwordLogin(this.passwordLoginForm.value as PasswordLoginCredentials);
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
