import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AuthApi } from "src/app/api/auth.api";
import { NavigationService } from "src/app/services/navigation.service";
import { LoginService } from "./login.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Subscription, first, of, throwError } from "rxjs";
import { TEST_GITHUB_CODE, TEST_LOGIN, TEST_PASSWORD } from "src/app/api/mock/auth.mock";
import { GithubLoginCredentials, PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { AuthenticationError } from "src/app/common/errors";

describe("LoginService", () => {
    let service: LoginService;
    let navigationService: NavigationService;
    let authApi: AuthApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(LoginService);
        navigationService = TestBed.inject(NavigationService);
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("succesful Github login navigates to home", () => {
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromGithubCallackCode").and.returnValue(of(void {}));
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };
        service.githubLogin(credentials);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it("failed Github login navigates to home, but throws an error", fakeAsync(() => {
        const errorText = "Unsupported login method";
        const exception = new AuthenticationError([new Error(errorText)]);

        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromGithubCallackCode").and.returnValue(
            throwError(() => exception),
        );
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };
        try {
            service.githubLogin(credentials);
            tick();
            fail("unexpected success");
        } catch (e) {
            expect(e).toEqual(exception);
        }

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    }));

    it("succesful password login navigates to home", () => {
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(of(void {}));
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it("failed password login emits an error", () => {
        const errorText = "Rejected credentials";
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(
            throwError(() => new AuthenticationError([new Error(errorText)])),
        );

        const errorSubscription$: Subscription = service.errorPasswordLogin.pipe(first()).subscribe((e: string) => {
            expect(e).toEqual(errorText);
        });

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials);
        expect(errorSubscription$.closed).toBeTrue();
    });

    it("reseting password login error emits empty error", () => {
        const errorSubscription$: Subscription = service.errorPasswordLogin.pipe(first()).subscribe((e: string) => {
            expect(e).toEqual("");
        });

        service.resetPasswordLoginError();

        expect(errorSubscription$.closed).toBeTrue();
    });
});
