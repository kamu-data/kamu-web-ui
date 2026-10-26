/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { verifyQueryError } from "src/app/query-explainer/query-explainer.helpers";
import {
    mockDatasetNotFoundError,
    mockVerifyQueryResponseSuccess,
} from "src/app/query-explainer/query-explainer.mocks";

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
