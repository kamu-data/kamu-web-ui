import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import ProjectLinks from "src/app/project-links";
import AppValues from "src/app/common/app.values";
import { LoginMethod } from "src/app/app-config.model";
import { LoginService } from "./login.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { MaybeNull } from "src/app/common/app.types";
import { Observable, shareReplay } from "rxjs";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
    public static readonly ERROR_ZERO_METHODS_IN_CONFIG =
        "LoginComponent requires at least 1 login method in configuration";

    readonly GITHUB_URL = ProjectLinks.GITHUB_URL;
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    public readonly LoginMethod = LoginMethod;

    public selectedLoginMethod?: LoginMethod = undefined;
    public passwordLoginForm: FormGroup;
    public passwordLoginError$: Observable<string> = this.loginService.errorPasswordLogin.pipe(shareReplay());

    public constructor(private fb: FormBuilder, private loginService: LoginService) {
        this.passwordLoginForm = this.fb.group({
            login: [
                "",
                [Validators.required],
            ],
            password: [
                "",
                [Validators.required],
            ],
        });
    }

    public ngOnInit(): void {
        const loginMethods: LoginMethod[] = this.loginService.loginMethods;
        if (loginMethods.length === 1) {
            this.onSelectedLoginMethod(loginMethods[0]);
        } else if (loginMethods.length === 0) {
            throw new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG);
        }
    }

    public get loginControl(): MaybeNull<AbstractControl> {
        return this.passwordLoginForm.get("login");
    }

    public get passwordControl(): MaybeNull<AbstractControl> {
        return this.passwordLoginForm.get("password");
    }

    public onSelectedLoginMethod(loginMethod: LoginMethod): void {
        this.selectedLoginMethod = loginMethod;
        if (loginMethod === LoginMethod.GITHUB) {
            LoginService.gotoGithub();
        }
    }

    public onPasswordLogin(): void {
        this.loginService.passwordLogin(this.passwordLoginForm.value as PasswordLoginCredentials);
    }

    public resetPasswordLoginError(): void {
        this.loginService.resetPasswordLoginError();
    }
}
