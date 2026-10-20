/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { getDefaultError, getSqlError } from "src/app/editor/helpers/editor-error-formatter";

describe("editor error formatter", () => {
    // monaco.MarkerSeverity.Error, which the formatter also falls back to when Monaco is not loaded
    const ERROR_SEVERITY = 8;

    it("should check SQL error keeps the message and reads the line and column", () => {
        const message = "sql parser error: Expected: end of statement, found: frm at Line: 3, Column: 17";

        const error = getSqlError(message);

        expect(error.message).toEqual(message);
        expect(error.line).toEqual(3);
        expect(error.col).toEqual(17);
        expect(error.severity).toEqual(ERROR_SEVERITY);
    });

    it("should check SQL error without a position has no line or column", () => {
        const error = getSqlError("sql parser error: Expected: an expression, found: EOF");

        expect(error.line).toBeUndefined();
        expect(error.col).toBeUndefined();
        expect(error.severity).toEqual(ERROR_SEVERITY);
    });

    it("should check default error keeps the message without a position", () => {
        const error = getDefaultError("Invalid YAML");

        expect(error).toEqual({ message: "Invalid YAML", severity: ERROR_SEVERITY });
    });
});
