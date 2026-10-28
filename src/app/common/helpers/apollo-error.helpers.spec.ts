/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { provideToastr, ToastrService } from "ngx-toastr";
import type { Mock } from "vitest";

import { ApolloErrorHandlingOptions, createApolloErrorHandler } from "@common/helpers/apollo-error.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { currentLocationPath } from "@common/helpers/url-params.helpers";
import { ErrorTexts } from "@common/values/errors.text";

import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("createApolloErrorHandler", () => {
    let handleError: (error: unknown, options?: ApolloErrorHandlingOptions) => void;
    let navigationService: NavigationService;
    let localStorageService: LocalStorageService;
    let toastrErrorSpy: Mock;

    function graphQLErrors(...messages: string[]): CombinedGraphQLErrors {
        return new CombinedGraphQLErrors({ errors: messages.map((message) => ({ message })) });
    }

    function unsignedJwt(expiresAtSeconds: number): string {
        const encode = (part: object) => btoa(JSON.stringify(part)).replace(/=+$/, "");
        return `${encode({ alg: "none" })}.${encode({ exp: expiresAtSeconds })}.`;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([]), provideToastr()],
        });
        navigationService = TestBed.inject(NavigationService);
        localStorageService = TestBed.inject(LocalStorageService);
        toastrErrorSpy = stubMethod(TestBed.inject(ToastrService), "error");
        handleError = TestBed.runInInjectionContext(() => createApolloErrorHandler());
    });

    afterEach(() => {
        localStorageService.setAccessToken(null);
    });

    it("should open the whitelist page for an account that is not whitelisted", () => {
        const navigateSpy = vi.spyOn(navigationService, "navigateToPath").mockImplementation(() => {});

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCOUNT_IS_NOT_WHITELISTED));

        expect(navigateSpy).toHaveBeenCalledTimes(1);

        expect(navigateSpy).toHaveBeenCalledWith(ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND);
        expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it("should report an expired access token and send the user to login", () => {
        const navigateSpy = vi.spyOn(navigationService, "navigateToLogin").mockImplementation(() => {});
        localStorageService.setAccessToken(unsignedJwt(Date.now() / 1000 - 60));

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_ACCESS_TOKEN_EXPIRED);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(currentLocationPath());
    });

    it("should report an access token error for a token that has not expired", () => {
        const navigateSpy = vi.spyOn(navigationService, "navigateToLogin").mockImplementation(() => {});
        localStorageService.setAccessToken(unsignedJwt(Date.now() / 1000 + 3600));

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_ACCESS_TOKEN);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(currentLocationPath());
    });

    it("should ignore an access token error when there is no token", () => {
        const navigateSpy = vi.spyOn(navigationService, "navigateToLogin").mockImplementation(() => {});

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).not.toHaveBeenCalled();
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should show one toast per other GraphQL error", () => {
        handleError(graphQLErrors("First", "Second"));

        expect(vi.mocked(toastrErrorSpy).mock.calls).toEqual([["First"], ["Second"]]);
    });

    it("should show no toast for GraphQL errors of an operation that skips them", () => {
        handleError(graphQLErrors("Repository does not support external transfers"), { skipErrorToast: true });

        expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it("should still open the whitelist page for an operation that skips error toasts", () => {
        const navigateSpy = stubMethod(navigationService, "navigateToPath");

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCOUNT_IS_NOT_WHITELISTED), { skipErrorToast: true });

        expect(navigateSpy).toHaveBeenCalledWith(ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND);
    });

    it("should log a network error and show a toast that stays", () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const networkError = new Error("connection refused");

        handleError(networkError);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

        expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_NETWORK_DESCRIPTION, "", {
            disableTimeOut: true,
        });
    });
});
