/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplayAccountNamePipe } from "./display-account-name.pipe";

describe("DisplayAccountNamePipe", () => {
    const pipe = new DisplayAccountNamePipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });
});
