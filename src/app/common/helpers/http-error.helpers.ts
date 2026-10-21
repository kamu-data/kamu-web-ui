/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpErrorResponse } from "@angular/common/http";

import { ErrorTexts } from "@common/values/errors.text";
import { MaybeNull } from "@interface/app.types";

/**
 * The message the server put in the body of an error response, or `null` when there is none.
 * The server answers with a JSON `{ message }` body, or with plain text for errors raised before
 * the handler runs, such as a 422 for a body that fails to deserialize. A status 0 response
 * never reached the server, so it has no server message.
 */
export function httpErrorServerMessage(e: unknown): MaybeNull<string> {
    if (!(e instanceof HttpErrorResponse) || e.status === 0) {
        return null;
    }
    const body: unknown = e.error;
    if (typeof body === "string") {
        return body || null;
    }
    const message: unknown = (body as MaybeNull<{ message?: unknown }>)?.message;
    return typeof message === "string" && message ? message : null;
}

/**
 * Text that describes a failed request: the server's message, else the message of an error
 * thrown outside HTTP, else a generic text.
 */
export function requestErrorText(e: unknown): string {
    const serverMessage = httpErrorServerMessage(e);
    if (serverMessage) {
        return serverMessage;
    }
    if (e instanceof Error && e.message) {
        return e.message;
    }
    return ErrorTexts.ERROR_TITLE_REQUEST_FAILED;
}
