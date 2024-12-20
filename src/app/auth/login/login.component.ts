import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import ProjectLinks from "src/app/project-links";
import AppValues from "src/app/common/app.values";
import { LoginMethod } from "src/app/app-config.model";
import { LoginService } from "./login.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { Observable, shareReplay } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { BaseComponent } from "src/app/common/base.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { LoginFormType } from "./login.component.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent implements OnInit {
    public static readonly ERROR_ZERO_METHODS_IN_CONFIG =
        "LoginComponent requires at least 1 login method in configuration";

    private localStorageService = inject(LocalStorageService);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private loginService = inject(LoginService);
    private appConfigService = inject(AppConfigService);

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    public readonly LoginMethod = LoginMethod;

    public selectedLoginMethod?: LoginMethod = undefined;
    public passwordLoginForm: FormGroup<LoginFormType> = this.fb.group({
        login: ["", [Validators.required]],
        password: ["", [Validators.required]],
    });
    public passwordLoginError$: Observable<string> =
        this.loginService.passwordLoginErrorOccurrences.pipe(shareReplay());

    public ngOnInit(): void {
        const loginMethods: LoginMethod[] = this.loginService.loginMethods;
        if (loginMethods.length === 1) {
            this.onSelectedLoginMethod(loginMethods[0]);
        } else if (loginMethods.length === 0) {
            throw new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG);
        }

        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams: Params) => {
            const callbackUrl: MaybeUndefined<string> = queryParams[
                ProjectLinks.URL_QUERY_PARAM_CALLBACK_URL
            ] as MaybeUndefined<string>;

            this.localStorageService.setLoginCallbackUrl(callbackUrl ?? null);
        });
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

    public onSelectedLoginMethod(loginMethod: LoginMethod): void {
        this.selectedLoginMethod = loginMethod;
        if (loginMethod === LoginMethod.GITHUB) {
            this.loginService.gotoGithub();
        }
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
