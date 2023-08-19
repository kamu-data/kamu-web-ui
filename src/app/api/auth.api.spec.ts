import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AuthApi } from "./auth.api";
import {
    AccountFragment,
    FetchAccountDetailsDocument,
    GetEnabledLoginMethodsDocument,
    GetEnabledLoginMethodsQuery,
    LoginDocument,
} from "./kamu.graphql.interface";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    mockAccountDetails,
    mockGithubLoginResponse,
    mockLogin401Error,
    mockPasswordLoginResponse,
    mockAccountFromAccessToken,
    TEST_ACCESS_TOKEN_GITHUB,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
} from "./mock/auth.mock";
import { AuthenticationError } from "../common/errors";
import { first } from "rxjs/operators";
import { GithubLoginCredentials, PasswordLoginCredentials } from "./auth.api.model";
import { LoginMethod } from "../app-config.model";

describe("AuthApi", () => {
    let service: AuthApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(AuthApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    function loginViaAccessToken(): void {
        service.fetchAccountFromAccessToken(TEST_ACCESS_TOKEN_GITHUB).subscribe();

        const op = controller.expectOne(FetchAccountDetailsDocument);
        expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN_GITHUB);

        op.flush({
            data: mockAccountFromAccessToken,
        });
    }

    function loginFullyViaGithub(): void {
        service
            .fetchAccountAndTokenFromGithubCallackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
            .subscribe();

        const expectedCredentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(LoginMethod.GITHUB);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockGithubLoginResponse,
        });
    }

    function loginFullyViaPassword(): void {
        service
            .fetchAccountAndTokenFromPasswordLogin({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            } as PasswordLoginCredentials)
            .subscribe();

        const expectedCredentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(LoginMethod.PASSWORD);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockPasswordLoginResponse,
        });
    }

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check login methods access", fakeAsync(() => {
        const mockEnabledLoginMethods: LoginMethod[] = [LoginMethod.GITHUB, LoginMethod.PASSWORD];
        const subscription$ = service
            .readEnabledLoginMethods()
            .pipe(first())
            .subscribe((enabledLoginMethods: LoginMethod[]) => {
                expect(enabledLoginMethods).toEqual(mockEnabledLoginMethods);
            });

        const op = controller.expectOne(GetEnabledLoginMethodsDocument);
        op.flush({
            data: {
                auth: {
                    enabledLoginMethods: mockEnabledLoginMethods,
                },
            } as GetEnabledLoginMethodsQuery,
        });

        tick();

        expect(subscription$.closed).toBeTrue();

        flush();
    }));

    it("should check full login password  success", fakeAsync(() => {
        const accessTokenObtained$ = service
            .accessTokenObtained()
            .pipe(first())
            .subscribe((token: string) => {
                expect(token).toEqual(mockPasswordLoginResponse.auth.login.accessToken);
            });

        const accountChanged$ = service
            .accountChanged()
            .pipe(first())
            .subscribe((user: AccountFragment) => {
                expect(user).toEqual(mockAccountDetails);
            });

        loginFullyViaPassword();
        tick();

        expect(accessTokenObtained$.closed).toBeTrue();
        expect(accountChanged$.closed).toBeTrue();
        flush();
    }));

    it("should check full login password failure", fakeAsync(() => {
        const subscription$ = service
            .fetchAccountAndTokenFromPasswordLogin({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            } as PasswordLoginCredentials)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    expect(e).toEqual(new AuthenticationError([mockLogin401Error]));
                },
            });

        const op = controller.expectOne(LoginDocument);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
        flush();
    }));

    it("should check full login Github success", fakeAsync(() => {
        const accessTokenObtained$ = service
            .accessTokenObtained()
            .pipe(first())
            .subscribe((token: string) => {
                expect(token).toEqual(mockGithubLoginResponse.auth.login.accessToken);
            });

        const accountChanged$ = service
            .accountChanged()
            .pipe(first())
            .subscribe((user: AccountFragment) => {
                expect(user).toEqual(mockAccountDetails);
            });

        loginFullyViaGithub();
        tick();

        expect(accessTokenObtained$.closed).toBeTrue();
        expect(accountChanged$.closed).toBeTrue();
        flush();
    }));

    it("should check full login Github failure", fakeAsync(() => {
        const subscription$ = service
            .fetchAccountAndTokenFromGithubCallackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    expect(e).toEqual(new AuthenticationError([mockLogin401Error]));
                },
            });

        const op = controller.expectOne(LoginDocument);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
        flush();
    }));

    it("should check login via access token success", fakeAsync(() => {
        const accessTokenObtained$ = service
            .accessTokenObtained()
            .pipe(first())
            .subscribe(() => {
                fail("Unexpected call of access token update");
            });

        const accountChanged$ = service
            .accountChanged()
            .pipe(first())
            .subscribe((user: AccountFragment) => {
                expect(user).toEqual(mockAccountDetails);
            });

        loginViaAccessToken();
        tick();

        expect(accessTokenObtained$.closed).toBeFalse();
        accessTokenObtained$.unsubscribe();

        expect(accountChanged$.closed).toBeTrue();
        flush();
    }));

    it("should check login via access token failure", fakeAsync(() => {
        const subscription$ = service
            .fetchAccountFromAccessToken(TEST_ACCESS_TOKEN_GITHUB)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    expect(e).toEqual(new AuthenticationError([mockLogin401Error]));
                },
            });

        const op = controller.expectOne(FetchAccountDetailsDocument);
        expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN_GITHUB);

        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
        flush();
    }));
});
