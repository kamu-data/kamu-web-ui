import { Injectable } from "@angular/core";
import { Observable, Subject, map } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubLoginCredentials, PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { LoginMethod } from "src/app/app-config.model";
import { AuthenticationError } from "src/app/common/errors";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    public constructor(private authApi: AuthApi, private navigationService: NavigationService) {}

    private errorPasswordLogin$: Subject<string> = new Subject<string>();
    private enabledLoginMethods: LoginMethod[] = [];

    public get errorPasswordLogin(): Observable<string> {
        return this.errorPasswordLogin$.asObservable();
    }

    public emitPasswordLoginError(errorText: string): void {
        this.errorPasswordLogin$.next(errorText);
    }

    public static gotoGithub(): void {
        window.location.href = ProjectLinks.GITHUB_URL;
    }

    public initialize(): Observable<void> {
        return this.authApi.readEnabledLoginMethods().pipe(
            map((enabledLoginMethods: LoginMethod[]): void => {
                this.enabledLoginMethods = enabledLoginMethods;
            }),
        );
    }

    public get loginMethods(): LoginMethod[] {
        return this.enabledLoginMethods;
    }

    public githubLogin(credentials: GithubLoginCredentials): void {
        this.authApi.fetchAccountAndTokenFromGithubCallackCode(credentials).subscribe({
            next: () => this.navigationService.navigateToHome(),
            error: (e) => {
                this.navigationService.navigateToHome();
                throw e;
            },
        });
    }

    public passwordLogin(credentials: PasswordLoginCredentials): void {
        this.authApi.fetchAccountAndTokenFromPasswordLogin(credentials).subscribe({
            next: () => this.navigationService.navigateToHome(),
            error: (e) => {
                if (e instanceof AuthenticationError) {
                    this.emitPasswordLoginError(e.compactMessage);
                } else {
                    throw e;
                }
            },
        });
    }

    public resetPasswordLoginError(): void {
        this.errorPasswordLogin$.next("");
    }
}
