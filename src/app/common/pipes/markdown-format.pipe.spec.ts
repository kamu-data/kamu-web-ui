/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MarkdownFormatPipe } from "./markdown-format.pipe";

describe("MarkdownFormatPipe", () => {
    const pipe = new MarkdownFormatPipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    [
        {
            value: "version: 1",
            format: "yaml",
            expectedResult: "```yaml\n" + "version: 1" + "\n```",
        },
        {
            value: "select * from 'test-dataset'",
            format: "sql",
            expectedResult: "```sql\n" + "select * from 'test-dataset'" + "\n```",
        },
        {
            value: "select * from 'test-dataset'",
            format: "unknown",
            expectedResult: "select * from 'test-dataset'",
        },
    ].forEach(({ value, format, expectedResult }) => {
        it("#MarkdownFormatPipe", () => {
            expect(pipe.transform(value, format)).toBe(expectedResult);
        });
    });
});
