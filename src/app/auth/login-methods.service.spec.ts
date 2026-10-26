/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { AuthApi } from "@api/auth.api";
import { AccountProvider } from "@api/kamu.graphql.interface";

import { LoginMethodsService } from "src/app/auth/login-methods.service";

describe("LoginMethodsService", () => {
    let service: LoginMethodsService;
    let authApi: AuthApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [AuthApi, Apollo, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(LoginMethodsService);
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should start with no methods and no load failure", () => {
        expect(service.loginMethods).toEqual([]);
        expect(service.loadFailed).toBe(false);
    });

    it("should keep the loaded methods", async () => {
        vi.spyOn(authApi, "readEnabledLoginMethods").mockReturnValue(
            of([AccountProvider.Password, AccountProvider.OauthGithub]),
        );

        await firstValueFrom(service.initialize());

        expect(service.loginMethods).toEqual([AccountProvider.Password, AccountProvider.OauthGithub]);
        expect(service.loadFailed).toBe(false);
    });

    it("should not report a failure when no method is enabled", async () => {
        vi.spyOn(authApi, "readEnabledLoginMethods").mockReturnValue(of([]));

        await firstValueFrom(service.initialize());

        expect(service.loginMethods).toEqual([]);
        expect(service.loadFailed).toBe(false);
    });

    it("should report a failure and pass the error on when the methods cannot be loaded", async () => {
        vi.spyOn(authApi, "readEnabledLoginMethods").mockReturnValue(throwError(() => new Error("Server unreachable")));

        await expect(firstValueFrom(service.initialize())).rejects.toThrowError("Server unreachable");

        expect(service.loginMethods).toEqual([]);
        expect(service.loadFailed).toBe(true);
    });
});
