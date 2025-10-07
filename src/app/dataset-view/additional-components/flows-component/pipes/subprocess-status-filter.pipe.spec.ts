/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SubprocessStatusFilterPipe } from "./subprocess-status-filter.pipe";

describe("SubprocessStatusFilterPipe", () => {
    it("create an instance", () => {
        const pipe = new SubprocessStatusFilterPipe();
        expect(pipe).toBeTruthy();
    });
});
