import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AuthApi } from "./auth.api";
import {
    FetchAccountDetailsDocument,
    GetEnabledLoginMethodsDocument,
    GetEnabledLoginMethodsQuery,
    LoginDocument,
} from "./kamu.graphql.interface";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    mockGithubLoginResponse,
    mockLogin401Error,
    mockPasswordLoginResponse,
    mockAccountFromAccessToken,
    TEST_ACCESS_TOKEN_GITHUB,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
} from "./mock/auth.mock";
import { AuthenticationError } from "../common/values/errors";
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

    it("should check full login password  success", () => {
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
    });

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

    it("should check full login Github success", () => {
        service
            .fetchAccountAndTokenFromGithubCallbackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
            .subscribe();

        const expectedCredentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(LoginMethod.GITHUB);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockGithubLoginResponse,
        });
    });

    it("should check full login Github failure", fakeAsync(() => {
        const subscription$ = service
            .fetchAccountAndTokenFromGithubCallbackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
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

    it("should check login via access token success", () => {
        service.fetchAccountFromAccessToken(TEST_ACCESS_TOKEN_GITHUB).subscribe();

        const op = controller.expectOne(FetchAccountDetailsDocument);
        expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN_GITHUB);

        op.flush({
            data: mockAccountFromAccessToken,
        });
    });

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
