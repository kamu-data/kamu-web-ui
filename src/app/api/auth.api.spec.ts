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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(AuthApi);
        navigationService = TestBed.inject(NavigationService);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    async function loginViaAccessToken(): Promise<void> {
        service
            .fetchUserInfoFromAccessToken(TEST_ACCESS_TOKEN)
            .subscribe(() => async () => {
                expect(service.isAuthenticated);
                await expect(service.currentUser).toBe(
                    mockUserInfoFromAccessToken.auth.accountInfo,
                );
            });
        const op = controller.expectOne(FetchAccountInfoDocument);
        await expect(op.operation.variables.accessToken).toEqual(
            TEST_ACCESS_TOKEN,
        );
        op.flush({
            data: mockUserInfoFromAccessToken,
        });
    }

    async function loginFullyViaGithub(): Promise<void> {
        const localStorageSetItemSpy = spyOn(
            localStorage,
            "setItem",
        ).and.stub();
        service
            .fetchUserInfoAndTokenFromGithubCallackCode(TEST_GITHUB_CODE)
            .subscribe(() => {
                expect(service.isAuthenticated);
                void expect(service.currentUser).toBe(
                    mockGithubLoginResponse.auth.githubLogin.accountInfo,
                );
                expect(localStorageSetItemSpy).toHaveBeenCalledWith(
                    AppValues.localStorageAccessToken,
                    mockGithubLoginResponse.auth.githubLogin.token.accessToken,
                );
            });
        const op = controller.expectOne(GithubLoginDocument);
        await expect(op.operation.variables.code).toEqual(TEST_GITHUB_CODE);
        op.flush({
            data: mockGithubLoginResponse,
        });
    }

    async function checkUserIsLogged(
        user: AccountDetailsFragment,
    ): Promise<void> {
        await expect(service.isAuthenticated).toBeTruthy();
        await expect(service.currentUser).toEqual(user);
    }

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should check user is initially non-authenticated", async () => {
        await expect(service.isAuthenticated).toBeFalsy();
        await expect(service.currentUser).toBeNull();
    });

    it("should check user changes via login with alive access token", fakeAsync(async () => {
        let callbackInvoked = false;
        service.onUserChanges.subscribe(
            (user: MaybeNull<AccountDetailsFragment>) => {
                callbackInvoked = true;
                user
                    ? void checkUserIsLogged(user)
                    : fail("User must not be null");
            },
        );
        await loginViaAccessToken();

        tick();

        await expect(callbackInvoked).toBeTruthy();
    }));

    it("should check user changes via full login with github", fakeAsync(async () => {
        let callbackInvoked = false;
        service.onUserChanges.subscribe(
            (user: MaybeNull<AccountDetailsFragment>) => {
                callbackInvoked = true;
                user
                    ? void checkUserIsLogged(user)
                    : fail("User must not be null");
            },
        );
        await loginFullyViaGithub();

        tick();

        await expect(callbackInvoked).toBeTruthy();
    }));

    it("should check full login GraphQL failure", fakeAsync(async () => {
        const subscription$ = service
            .fetchUserInfoAndTokenFromGithubCallackCode(TEST_GITHUB_CODE)
            .pipe(first())
            .subscribe(
                () => fail("Unexpected success"),
                (e: Error) => {
                    void expect(e).toEqual(new AuthenticationError([mockLogin401Error]));
                }
            );

        const op = controller.expectOne(GithubLoginDocument);
        await expect(op.operation.variables.code).toEqual(TEST_GITHUB_CODE);
        op.graphqlErrors([mockLogin401Error]);

        tick();

        await expect(subscription$.closed).toBeTruthy();
    }));

    it("should check login via access token GraphQL failure", fakeAsync(async () => {
        const subscription$ = service
            .fetchUserInfoFromAccessToken(TEST_ACCESS_TOKEN)
            .pipe(first())
            .subscribe(
                () => fail("Unexpected success"),
                (e: Error) => {
                    void expect(e).toEqual(new AuthenticationError([mockLogin401Error]));
                }
            );

        const op = controller.expectOne(FetchAccountInfoDocument);
        await expect(op.operation.variables.accessToken).toEqual(
            TEST_ACCESS_TOKEN,
        );
        op.graphqlErrors([mockLogin401Error]);

        tick();

        await expect(subscription$.closed).toBeTruthy();        
    }));

    it("should check user logout navigates to home page", async () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToHome");
        await loginViaAccessToken();
        service.logOut();
        await expect(service.currentUser).toBeNull();
        await expect(navigationServiceSpy).toHaveBeenCalled();
    });
});
