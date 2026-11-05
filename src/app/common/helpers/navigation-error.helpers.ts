/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ErrorHandler, inject } from "@angular/core";
import { NavigationError, RedirectCommand, Router } from "@angular/router";

import { AccountNotFoundError, DatasetNotFoundError } from "@common/values/errors";
import { MaybeUndefined } from "@interface/app.types";

import { NavigationService } from "src/app/services/navigation.service";

/**
 * The router's navigation error handler. When the first page the app opens fails to load, it
 * reports the error and leads to the page-load-failed view, since nothing else would be on screen.
 * A failed later navigation leaves the user on the current page, and a not-found error goes on to
 * the error handler, which shows the page-not-found view. Call it in an injection context.
 */
export function pageLoadFailedOnInitialNavigation(navigationError: NavigationError): MaybeUndefined<RedirectCommand> {
    const router = inject(Router);
    const errorHandler = inject(ErrorHandler);
    const navigationService = inject(NavigationService);

    const error: unknown = navigationError.error;
    if (router.navigated || error instanceof DatasetNotFoundError || error instanceof AccountNotFoundError) {
        return undefined;
    }
    // The router passes on no error it redirects for
    errorHandler.handleError(error);
    return navigationService.pageLoadFailedRedirect();
}
