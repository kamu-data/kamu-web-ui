/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of, Subject, throwError } from "rxjs";

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

    describe("loadSettledChanges", () => {
        let enabledLoginMethods$: Subject<AccountProvider[]>;
        let settled: boolean;

        beforeEach(() => {
            enabledLoginMethods$ = new Subject<AccountProvider[]>();
            vi.spyOn(authApi, "readEnabledLoginMethods").mockReturnValue(enabledLoginMethods$);
            settled = false;
            service.loadSettledChanges.subscribe(() => (settled = true));
            service.initialize().subscribe({ error: () => undefined });
        });

        it("should not emit while the methods are loading", () => {
            expect(settled).toBe(false);
        });

        it("should emit once the methods are loaded", () => {
            enabledLoginMethods$.next([AccountProvider.Password]);
            enabledLoginMethods$.complete();

            expect(settled).toBe(true);
            expect(service.loginMethods).toEqual([AccountProvider.Password]);
        });

        it("should emit once the load fails", () => {
            enabledLoginMethods$.error(new Error("Server unreachable"));

            expect(settled).toBe(true);
            expect(service.loadFailed).toBe(true);
        });

        it("should replay to a subscriber that arrives after the load", async () => {
            enabledLoginMethods$.next([]);
            enabledLoginMethods$.complete();

            await expect(firstValueFrom(service.loadSettledChanges)).resolves.toBeUndefined();
        });
    });
});
