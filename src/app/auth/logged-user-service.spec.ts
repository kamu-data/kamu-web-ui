import { Apollo } from "apollo-angular";
import { AuthApi } from "../api/auth.api";
import { LoggedUserService } from "./logged-user.service";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { NavigationService } from "../services/navigation.service";
import {
    TEST_ACCESS_TOKEN_GITHUB,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
    mockAccountDetails,
    mockGithubLoginResponse,
    mockLoginInstructions,
    mockPasswordLoginResponse,
    mockAccountFromAccessToken,
} from "../api/mock/auth.mock";
import { AccountFragment, FetchAccountDetailsDocument, LoginDocument } from "../api/kamu.graphql.interface";
import { first } from "rxjs/operators";
import { MaybeNull } from "../common/app.types";
import AppValues from "../common/app.values";
import { AppConfigService } from "../app-config.service";
import { GithubLoginCredentials, PasswordLoginCredentials } from "../api/auth.api.model";

describe("LoggedUserService", () => {
    let service: LoggedUserService;
    let controller: ApolloTestingController;

    describe("Main Test Suite", () => {
        let navigationService: NavigationService;
        let authApi: AuthApi;
        let apollo: Apollo;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [AuthApi, Apollo],
                imports: [ApolloTestingModule],
            });
            service = TestBed.inject(LoggedUserService);
            apollo = TestBed.inject(Apollo);
            navigationService = TestBed.inject(NavigationService);
            authApi = TestBed.inject(AuthApi);
            controller = TestBed.inject(ApolloTestingController);
        });

        function checkUserIsLogged(user: AccountFragment): void {
            expect(service.isAuthenticated).toBeTrue();
            expect(service.currentlyLoggedInUser).toEqual(user);
        }

        function attemptSuccessfulLoginViaAccessToken(): void {
            const localStorageGetItemSpy = spyOn(localStorage, "getItem").and.returnValue(TEST_ACCESS_TOKEN_GITHUB);

            service.initialize().subscribe();

            const op = controller.expectOne(FetchAccountDetailsDocument);
            expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN_GITHUB);

            op.flush({
                data: mockAccountFromAccessToken,
            });

            expect(localStorageGetItemSpy).toHaveBeenCalledOnceWith(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        }

        function loginFullyViaGithub(): void {
            authApi
                .fetchAccountAndTokenFromGithubCallackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
                .subscribe();

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockGithubLoginResponse,
            });
        }

        function loginFullyViaPassword(): void {
            authApi
                .fetchAccountAndTokenFromPasswordLogin({
                    login: TEST_LOGIN,
                    password: TEST_PASSWORD,
                } as PasswordLoginCredentials)
                .subscribe();

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockPasswordLoginResponse,
            });
        }

        it("should be created", () => {
            expect(service).toBeTruthy();
        });

        it("should check user is initially non-authenticated", () => {
            expect(service.isAuthenticated).toBeFalse();
            expect(service.currentlyLoggedInUser).toBeNull();
        });

        it("should check user is non-authenticated if no access token exists", () => {
            const localStorageGetItemSpy = spyOn(localStorage, "getItem").and.returnValue(null);

            service.initialize().subscribe();

            controller.expectNone(FetchAccountDetailsDocument);
            expect(service.isAuthenticated).toBeFalse();
            expect(localStorageGetItemSpy).toHaveBeenCalledOnceWith(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        });

        it("should check user changes via login with alive access token", fakeAsync(() => {
            attemptSuccessfulLoginViaAccessToken();
            tick();

            const userChanges$ = service.onLoggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });
            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user changes via full login Github", fakeAsync(() => {
            const localStorageSetItemSpy = spyOn(localStorage, "setItem");

            loginFullyViaGithub();
            tick();

            const userChanges$ = service.onLoggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });

            expect(localStorageSetItemSpy).toHaveBeenCalledWith(
                AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
                mockGithubLoginResponse.auth.login.accessToken,
            );

            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user changes via full login password", fakeAsync(() => {
            const localStorageSetItemSpy = spyOn(localStorage, "setItem");

            loginFullyViaPassword();
            tick();

            const userChanges$ = service.onLoggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });

            expect(localStorageSetItemSpy).toHaveBeenCalledWith(
                AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
                mockPasswordLoginResponse.auth.login.accessToken,
            );

            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user logout navigates to home page and clears GraphQL cache", fakeAsync(() => {
            const navigationServiceSpy = spyOn(navigationService, "navigateToHome");
            const apolloClientSpy = spyOn(apollo.client, "clearStore").and.resolveTo();

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.logout();

            expect(service.currentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).toHaveBeenCalledWith();
            expect(apolloClientSpy).toHaveBeenCalledTimes(1);
            flush();
        }));

        it("should check user terminate session does not navigate to home page", fakeAsync(() => {
            const navigationServiceSpy = spyOn(navigationService, "navigateToHome");

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.terminateSession();

            expect(service.currentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).not.toHaveBeenCalled();
            flush();
        }));
    });

    describe("Custom configuration", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    AuthApi,
                    Apollo,
                    {
                        provide: AppConfigService,
                        useFactory: () => {
                            const realService = new AppConfigService();
                            spyOnProperty(realService, "loginInstructions", "get").and.returnValue(
                                mockLoginInstructions,
                            );
                            return realService;
                        },
                    },
                ],
                imports: [ApolloTestingModule],
            });
            service = TestBed.inject(LoggedUserService);
            controller = TestBed.inject(ApolloTestingController);
        });

        it("should use custom configuration's initial user", fakeAsync(() => {
            service.initialize().subscribe();

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockPasswordLoginResponse,
            });

            tick();

            expect(service.isAuthenticated).toBeTrue();
            expect(service.currentlyLoggedInUser).toEqual(mockAccountDetails);
            flush();
        }));
    });
});
