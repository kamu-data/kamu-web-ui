/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetOperationError } from "@common/values/errors";

describe("KamuMultiError", () => {
    [
        { messages: [], expected: "" },
        { messages: ["Only one"], expected: "Only one" },
        { messages: ["First", "Second", "Third"], expected: "First. Second. Third" },
    ].forEach(({ messages, expected }) => {
        it(`should join ${messages.length} messages into "${expected}"`, () => {
            const error = new DatasetOperationError(messages.map((message) => ({ message })));
            expect(error.compactMessage).toEqual(expected);
        });
    });
});
