/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AuthApi } from "./auth.api";
import {
    AccountProvider,
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
    mockWeb3WalletLoginResponse,
} from "./mock/auth.mock";
import { AuthenticationError } from "../common/values/errors";
import { first } from "rxjs/operators";
import {
    GithubLoginCredentials,
    PasswordLoginCredentials,
    Web3WalletOwnershipVerificationRequest,
} from "./auth.api.model";
import { ApolloError } from "@apollo/client";

fdescribe("AuthApi", () => {
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
        const mockEnabledLoginMethods: AccountProvider[] = [AccountProvider.OauthGithub, AccountProvider.Password];
        const subscription$ = service
            .readEnabledLoginMethods()
            .pipe(first())
            .subscribe((enabledLoginMethods: AccountProvider[]) => {
                expect(enabledLoginMethods).toEqual(mockEnabledLoginMethods);
            });

        const op = controller.expectOne(GetEnabledLoginMethodsDocument);
        op.flush({
            data: {
                auth: {
                    enabledProviders: mockEnabledLoginMethods,
                },
            } as GetEnabledLoginMethodsQuery,
        });

        tick();

        expect(subscription$.closed).toBeTrue();

        flush();
    }));

    it("should check full login password success", () => {
        service
            .fetchAccountAndTokenFromPasswordLogin({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            } as PasswordLoginCredentials)
            .subscribe();

        const expectedCredentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(AccountProvider.Password);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockPasswordLoginResponse,
        });
    });

    it("should check full login password failure", fakeAsync(() => {
        let receivedError: ApolloError | null = null;
        const subscription$ = service
            .fetchAccountAndTokenFromPasswordLogin({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            } as PasswordLoginCredentials)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: ApolloError) => {
                    receivedError = e;
                },
            });

        const op = controller.expectOne(LoginDocument);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(receivedError).toBeTruthy();
        expect(subscription$.closed).toBeTrue();
        flush();
    }));

    it("should check full login Github success", () => {
        service
            .fetchAccountAndTokenFromGithubCallbackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
            .subscribe();

        const expectedCredentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(AccountProvider.OauthGithub);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockGithubLoginResponse,
        });
    });

    it("should check full login Github failure", fakeAsync(() => {
        let receivedError: ApolloError | null = null;
        const subscription$ = service
            .fetchAccountAndTokenFromGithubCallbackCode({ code: TEST_GITHUB_CODE } as GithubLoginCredentials)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: ApolloError) => {
                    receivedError = e;
                },
            });

        const op = controller.expectOne(LoginDocument);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(receivedError).toBeTruthy();
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

    it("should check login via access token error", fakeAsync(() => {
        let receivedError: ApolloError | null = null;
        const subscription$ = service
            .fetchAccountFromAccessToken(TEST_ACCESS_TOKEN_GITHUB)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: ApolloError) => {
                    receivedError = e;
                },
            });

        const op = controller.expectOne(FetchAccountDetailsDocument);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(receivedError).toBeTruthy();
        expect(subscription$.closed).toBeTrue();
        flush();
    }));

    it("should check full login web3 wallet success", () => {
        const expectedCredentials: Web3WalletOwnershipVerificationRequest = {
            message: "test message",
            signature: "signature",
        };

        service.fetchAccountAndTokenFromWeb3Wallet(expectedCredentials).subscribe();

        const op = controller.expectOne(LoginDocument);
        expect(op.operation.variables.login_method).toEqual(AccountProvider.Web3Wallet);
        expect(op.operation.variables.login_credentials_json).toEqual(JSON.stringify(expectedCredentials));

        op.flush({
            data: mockWeb3WalletLoginResponse,
        });
    });
});
