/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { enumValueOf, isRecord } from "@common/helpers/app.helpers";
import { MaybeNull } from "@interface/app.types";

import {
    VerifyQueryError,
    VerifyQueryFailureResponse,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "src/app/query-explainer/query-explainer.types";

export function verifyQueryError(response: MaybeNull<VerifyQueryResponse>): MaybeNull<VerifyQueryError> {
    return response?.ok === false ? response.error : null;
}

/** The failure a `/verify` response body reports, or `null` when the body is not one. */
export function parseVerifyQueryFailure(body: unknown): MaybeNull<VerifyQueryFailureResponse> {
    if (!isRecord(body) || body.ok !== false) return null;
    const error = parseVerifyQueryError(body.error);
    return error ? { ok: false, error } : null;
}

function parseVerifyQueryError(error: unknown): MaybeNull<VerifyQueryError> {
    if (!isRecord(error)) return null;
    const message = typeof error.message === "string" ? error.message : "";
    return parseKnownVerifyQueryError(error, message) ?? { kind: "Unknown", message };
}

function parseKnownVerifyQueryError(error: Record<string, unknown>, message: string): MaybeNull<VerifyQueryError> {
    const { dataset_id, block_hash, expected_hash, actual_hash } = error;
    const kind = enumValueOf(VerifyQueryKindError, error.kind);
    switch (kind) {
        case VerifyQueryKindError.InputHash:
        case VerifyQueryKindError.SubQueriesHash:
        case VerifyQueryKindError.BadSignature:
            return { kind, message };
        case VerifyQueryKindError.OutputMismatch:
            return typeof expected_hash === "string" && typeof actual_hash === "string"
                ? { kind, message, expected_hash, actual_hash }
                : null;
        case VerifyQueryKindError.DatasetNotFound:
            return typeof dataset_id === "string" ? { kind, message, dataset_id } : null;
        case VerifyQueryKindError.DatasetBlockNotFound:
            return typeof dataset_id === "string" && typeof block_hash === "string"
                ? { kind, message, dataset_id, block_hash }
                : null;
        case undefined:
            return null;
    }
}
