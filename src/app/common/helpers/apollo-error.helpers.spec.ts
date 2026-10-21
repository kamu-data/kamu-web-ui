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

import { createApolloErrorHandler } from "@common/helpers/apollo-error.helpers";
import { ErrorTexts } from "@common/values/errors.text";

import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("createApolloErrorHandler", () => {
    let handleError: (error: unknown) => void;
    let navigationService: NavigationService;
    let localStorageService: LocalStorageService;
    let toastrErrorSpy: jasmine.Spy;

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
        toastrErrorSpy = spyOn(TestBed.inject(ToastrService), "error");
        handleError = TestBed.runInInjectionContext(() => createApolloErrorHandler());
    });

    afterEach(() => {
        localStorageService.setAccessToken(null);
    });

    it("should open the whitelist page for an account that is not whitelisted", () => {
        const navigateSpy = spyOn(navigationService, "navigateToPath");

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCOUNT_IS_NOT_WHITELISTED));

        expect(navigateSpy).toHaveBeenCalledOnceWith(ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND);
        expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it("should report an expired access token and send the user to login", () => {
        const navigateSpy = spyOn(navigationService, "navigateToLogin");
        localStorageService.setAccessToken(unsignedJwt(Date.now() / 1000 - 60));

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(ErrorTexts.ERROR_ACCESS_TOKEN_EXPIRED);
        expect(navigateSpy).toHaveBeenCalledOnceWith(window.location.pathname);
    });

    it("should report an access token error for a token that has not expired", () => {
        const navigateSpy = spyOn(navigationService, "navigateToLogin");
        localStorageService.setAccessToken(unsignedJwt(Date.now() / 1000 + 3600));

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(ErrorTexts.ERROR_ACCESS_TOKEN);
        expect(navigateSpy).toHaveBeenCalledOnceWith(window.location.pathname);
    });

    it("should ignore an access token error when there is no token", () => {
        const navigateSpy = spyOn(navigationService, "navigateToLogin");

        handleError(graphQLErrors(ErrorTexts.ERROR_ACCESS_TOKEN));

        expect(toastrErrorSpy).not.toHaveBeenCalled();
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should show one toast per other GraphQL error", () => {
        handleError(graphQLErrors("First", "Second"));

        expect(toastrErrorSpy.calls.allArgs()).toEqual([["First"], ["Second"]]);
    });

    it("should log a network error and show a toast that stays", () => {
        const consoleErrorSpy = spyOn(console, "error");
        const networkError = new Error("connection refused");

        handleError(networkError);

        expect(consoleErrorSpy).toHaveBeenCalledOnceWith(networkError);

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(ErrorTexts.ERROR_NETWORK_DESCRIPTION, "", {
            disableTimeOut: true,
        });
    });
});
