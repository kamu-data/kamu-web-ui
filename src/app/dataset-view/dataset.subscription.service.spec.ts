/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";

describe("DatasetSubscriptionsService", () => {
    let service: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
