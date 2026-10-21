/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injector } from "@angular/core";

import { ApolloLink } from "@apollo/client/core";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { ToastrService } from "ngx-toastr";

import { isAccessTokenExpired, logError } from "@common/helpers/app.helpers";
import { ErrorTexts } from "@common/values/errors.text";

import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

/**
 * Reacts to an error of any GraphQL operation: an account that is not whitelisted or an invalid
 * access token navigates away, other GraphQL errors show a toast each, and a network error shows
 * a toast that stays. Create it in an injection context; call it from anywhere.
 */
export function createApolloErrorHandler(): (error: unknown) => void {
    const injector = inject(Injector);
    const navigationService = inject(NavigationService);
    const localStorageService = inject(LocalStorageService);

    return (error: unknown) => {
        // Resolved lazily: ToastrService depends on services that are still being created at this point
        const toastrService = injector.get(ToastrService);

        if (CombinedGraphQLErrors.is(error)) {
            const graphQLErrors = error.errors;
            if (graphQLErrors.length === 0) {
                return;
            }
            const firstMsg = graphQLErrors[0].message;
            if (firstMsg === ErrorTexts.ERROR_ACCOUNT_IS_NOT_WHITELISTED) {
                navigationService.navigateToPath(ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND);
            } else if (firstMsg === ErrorTexts.ERROR_ACCESS_TOKEN) {
                const token = localStorageService.accessToken;
                if (token) {
                    toastrService.error(isAccessTokenExpired(token) ? ErrorTexts.ERROR_ACCESS_TOKEN_EXPIRED : firstMsg);
                    navigationService.navigateToLogin(window.location.pathname);
                }
            } else {
                graphQLErrors.forEach((err) => toastrService.error(err.message));
            }
        } else if (error) {
            logError(error);
            toastrService.error(ErrorTexts.ERROR_NETWORK_DESCRIPTION, "", {
                disableTimeOut: true,
            });
        }
    };
}

/** The Apollo link that passes every operation error to `createApolloErrorHandler`. Create it in an injection context. */
export function createApolloErrorLink(): ApolloLink {
    const handleError = createApolloErrorHandler();
    return new ErrorLink(({ error }) => handleError(error));
}
