/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpErrorResponse } from "@angular/common/http";

// The only type assertions app code makes: values that arrive as `any`, whose shape only the caller
// knows. Nothing checks it, so a wrong claim surfaces where the value is read. eslint exempts this
// file from `consistent-type-assertions`.

/** Parses JSON whose shape the caller knows: the app's own storage, a config file, an API field holding JSON. */
export function parseJsonAs<T>(text: string): T {
    return JSON.parse(text) as T;
}

/** The body of an HTTP error response, in the shape the endpoint documents for that status. */
export function httpErrorBodyAs<T>(error: HttpErrorResponse): T {
    return error.error as T;
}
