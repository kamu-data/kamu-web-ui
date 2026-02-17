/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { CancelRequestService } from "src/app/services/cancel-request.service";

describe("CancelRequestService", () => {
    let service: CancelRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CancelRequestService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
