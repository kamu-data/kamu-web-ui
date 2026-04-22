/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { PreviewFileTypePipe } from "./preview-file-type.pipe";

describe("PreviewFileTypePipe", () => {
    const pipe = new PreviewFileTypePipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    [
        { case: "", expected: "unknown" },
        { case: "application/pdf", expected: "pdf" },
        { case: "image/png", expected: "image" },
        { case: "video/mp4", expected: "video" },
        { case: "audio/mpeg", expected: "audio" },
        { case: "text/plain", expected: "text" },
        { case: "application/json", expected: "json" },
        { case: "application/octet-stream", expected: "text" },
        { case: "test", expected: "unknown" },
    ].forEach((item: { case: string; expected: string }) => {
        it(`should check transform method with  ${item.case}`, () => {
            expect(pipe.transform(item.case)).toEqual(item.expected);
        });
    });
});
