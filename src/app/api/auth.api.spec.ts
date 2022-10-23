import { NavigationService } from "src/app/services/navigation.service";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AuthApi } from "./auth.api";
import {
    AccountDetailsFragment,
    FetchAccountInfoDocument,
    GithubLoginDocument,
} from "./kamu.graphql.interface";
import {
    ApolloTestingController,
    ApolloTestingModule,
} from "apollo-angular/testing";
import {
    mockGithubLoginResponse,
    mockLogin401Error,
    mockUserInfoFromAccessToken,
    TEST_ACCESS_TOKEN,
    TEST_GITHUB_CODE,
} from "./mock/auth.mock";
import AppValues from "../common/app.values";
import { MaybeNull } from "../common/app.types";
import { AuthenticationError } from "../common/errors";
import { first } from "rxjs/operators";

describe("AuthApi", () => {
    let service: AuthApi;
    let navigationService: NavigationService;
    let controller: ApolloTestingController;
    let localStorageSetItemSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(AuthApi);
        navigationService = TestBed.inject(NavigationService);
        controller = TestBed.inject(ApolloTestingController);
        localStorageSetItemSpy = spyOn(localStorage, "setItem").and.stub();
    });

    afterEach(() => {
        controller.verify();
    });

    function loginViaAccessToken(): void {
        service
            .fetchUserInfoFromAccessToken(TEST_ACCESS_TOKEN)
            .subscribe(() => {
                expect(service.isAuthenticated).toBeTrue();
                expect(service.currentUser).toBe(
                    mockUserInfoFromAccessToken.auth.accountInfo,
                );
            });

        const op = controller.expectOne(FetchAccountInfoDocument);
        expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN);

        op.flush({
            data: mockUserInfoFromAccessToken,
        });
    }

    function loginFullyViaGithub(): void {
        service
            .fetchUserInfoAndTokenFromGithubCallackCode(TEST_GITHUB_CODE)
            .subscribe(() => {
                expect(service.isAuthenticated).toBeTrue();
                expect(service.currentUser).toBe(
                    mockGithubLoginResponse.auth.githubLogin.accountInfo,
                );
                expect(localStorageSetItemSpy).toHaveBeenCalledWith(
                    AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
                    mockGithubLoginResponse.auth.githubLogin.token.accessToken,
                );
            });

        const op = controller.expectOne(GithubLoginDocument);
        expect(op.operation.variables.code).toEqual(TEST_GITHUB_CODE);

        op.flush({
            data: mockGithubLoginResponse,
        });
    }

    function checkUserIsLogged(user: AccountDetailsFragment): void {
        expect(service.isAuthenticated).toBeTrue();
        expect(service.currentUser).toEqual(user);
    }

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check user is initially non-authenticated", () => {
        expect(service.isAuthenticated).toBeFalse();
        expect(service.currentUser).toBeNull();
    });

    it("should check user changes via login with alive access token", fakeAsync(() => {
        let callbackInvoked = false;
        service.onUserChanges.subscribe(
            (user: MaybeNull<AccountDetailsFragment>) => {
                callbackInvoked = true;
                user ? checkUserIsLogged(user) : fail("User must not be null");
            },
        );

        loginViaAccessToken();
        tick();

        expect(callbackInvoked).toBeTrue();
    }));

    it("should check user changes via full login with github", fakeAsync(() => {
        let callbackInvoked = false;
        service.onUserChanges.subscribe(
            (user: MaybeNull<AccountDetailsFragment>) => {
                callbackInvoked = true;
                user ? checkUserIsLogged(user) : fail("User must not be null");
            },
        );

        loginFullyViaGithub();
        tick();

        expect(callbackInvoked).toBeTruthy();
    }));

    it("should check full login GraphQL failure", fakeAsync(() => {
        const subscription$ = service
            .fetchUserInfoAndTokenFromGithubCallackCode(TEST_GITHUB_CODE)
            .pipe(first())
            .subscribe(
                () => fail("Unexpected success"),
                (e: Error) => {
                    expect(e).toEqual(
                        new AuthenticationError([mockLogin401Error]),
                    );
                },
            );

        const op = controller.expectOne(GithubLoginDocument);
        expect(op.operation.variables.code).toEqual(TEST_GITHUB_CODE);

        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check login via access token GraphQL failure", fakeAsync(() => {
        const subscription$ = service
            .fetchUserInfoFromAccessToken(TEST_ACCESS_TOKEN)
            .pipe(first())
            .subscribe(
                () => fail("Unexpected success"),
                (e: Error) => {
                    expect(e).toEqual(
                        new AuthenticationError([mockLogin401Error]),
                    );
                },
            );

        const op = controller.expectOne(FetchAccountInfoDocument);
        expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN);

        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check user logout navigates to home page", () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToHome");
        loginViaAccessToken();
        service.logOut();
        expect(service.currentUser).toBeNull();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });
});
