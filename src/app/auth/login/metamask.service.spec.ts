/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { MetamaskService } from "./metamask.service";

describe("MetamaskService", () => {
    let service: MetamaskService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MetamaskService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
