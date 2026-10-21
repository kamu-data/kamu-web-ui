/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpErrorResponse } from "@angular/common/http";

import { httpErrorServerMessage, requestErrorText } from "@common/helpers/http-error.helpers";
import { ErrorTexts } from "@common/values/errors.text";

describe("http error helpers", () => {
    const SERVER_MESSAGE = "Table 'missing' not found";
    const URL = "http://localhost:8080/query";

    function httpError(error: unknown, status: number): HttpErrorResponse {
        return new HttpErrorResponse({ error, status, url: URL });
    }

    describe("httpErrorServerMessage", () => {
        it("should read the message of a JSON body", () => {
            expect(httpErrorServerMessage(httpError({ message: SERVER_MESSAGE }, 500))).toEqual(SERVER_MESSAGE);
        });

        it("should read a plain-text body", () => {
            expect(httpErrorServerMessage(httpError(SERVER_MESSAGE, 422))).toEqual(SERVER_MESSAGE);
        });

        it("should give null for a response without a body message", () => {
            expect(httpErrorServerMessage(httpError(null, 502))).toBeNull();
            expect(httpErrorServerMessage(httpError("", 502))).toBeNull();
            expect(httpErrorServerMessage(httpError({ message: 42 }, 500))).toBeNull();
            expect(httpErrorServerMessage(httpError({}, 500))).toBeNull();
        });

        it("should give null for a response that never reached the server", () => {
            expect(httpErrorServerMessage(httpError(new ProgressEvent("error"), 0))).toBeNull();
            expect(httpErrorServerMessage(httpError(SERVER_MESSAGE, 0))).toBeNull();
        });

        it("should give null for an error that is not an HTTP response", () => {
            expect(httpErrorServerMessage(new Error(SERVER_MESSAGE))).toBeNull();
            expect(httpErrorServerMessage({ message: SERVER_MESSAGE })).toBeNull();
        });
    });

    describe("requestErrorText", () => {
        it("should prefer the message of a JSON body", () => {
            expect(requestErrorText(httpError({ message: SERVER_MESSAGE }, 500))).toEqual(SERVER_MESSAGE);
        });

        it("should use a plain-text body", () => {
            expect(requestErrorText(httpError(SERVER_MESSAGE, 422))).toEqual(SERVER_MESSAGE);
        });

        it("should use the message of an error thrown outside HTTP", () => {
            expect(requestErrorText(new Error("Unsupported subQueries array"))).toEqual("Unsupported subQueries array");
        });

        it("should fall back to a generic text for an HTTP error without a body message", () => {
            expect(requestErrorText(httpError(null, 502))).toEqual(ErrorTexts.ERROR_TITLE_REQUEST_FAILED);
        });

        it("should fall back to a generic text for an unknown error", () => {
            expect(requestErrorText("boom")).toEqual(ErrorTexts.ERROR_TITLE_REQUEST_FAILED);
            expect(requestErrorText(undefined)).toEqual(ErrorTexts.ERROR_TITLE_REQUEST_FAILED);
            expect(requestErrorText(new Error(""))).toEqual(ErrorTexts.ERROR_TITLE_REQUEST_FAILED);
        });
    });
});
