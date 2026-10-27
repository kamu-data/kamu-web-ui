/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { parseVerifyQueryFailure, verifyQueryError } from "src/app/query-explainer/query-explainer.helpers";
import {
    mockDatasetBlockNotFoundError,
    mockDatasetNotFoundError,
    mockVerifyQueryOutputMismatchError,
    mockVerifyQueryResponseSuccess,
} from "src/app/query-explainer/query-explainer.mocks";
import { VerifyQueryKindError } from "src/app/query-explainer/query-explainer.types";

describe("verifyQueryError", () => {
    it("should return the error of a failed verification", () => {
        expect(verifyQueryError(mockDatasetNotFoundError)).toEqual(mockDatasetNotFoundError.error);
    });

    it("should return null for a successful verification", () => {
        expect(verifyQueryError(mockVerifyQueryResponseSuccess)).toBeNull();
    });

    it("should return null while there is no verification response", () => {
        expect(verifyQueryError(null)).toBeNull();
    });
});

describe("parseVerifyQueryFailure", () => {
    it.each([mockDatasetNotFoundError, mockDatasetBlockNotFoundError, mockVerifyQueryOutputMismatchError])(
        "should read a $error.kind failure",
        (failure) => {
            expect(parseVerifyQueryFailure(structuredClone(failure))).toEqual(failure);
        },
    );

    it("should read a failure of a kind that carries only its message", () => {
        const body = { ok: false, error: { kind: VerifyQueryKindError.BadSignature, message: "Bad signature" } };

        expect(parseVerifyQueryFailure(body)).toEqual(body);
    });

    it.each([
        ["an unknown kind", { kind: "NewKind", message: "Error" }],
        ["a kind without the fields it carries", { kind: VerifyQueryKindError.DatasetNotFound, message: "Error" }],
    ])("should read a failure of %s as one that shows only its message", (_, error) => {
        expect(parseVerifyQueryFailure({ ok: false, error })).toEqual({
            ok: false,
            error: { kind: "Unknown", message: "Error" },
        });
    });

    it("should read a failure without a message", () => {
        expect(parseVerifyQueryFailure({ ok: false, error: { kind: VerifyQueryKindError.InputHash } })).toEqual({
            ok: false,
            error: { kind: VerifyQueryKindError.InputHash, message: "" },
        });
    });

    it.each([
        ["a success", mockVerifyQueryResponseSuccess],
        ["a plain-text body", "Bad request"],
        ["a failure without an error", { ok: false }],
    ])("should return null for %s", (_, body) => {
        expect(parseVerifyQueryFailure(body)).toBeNull();
    });
});
