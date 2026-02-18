/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { MapQueryTrackerService } from "./map-query-tracker.service";

describe("MapQueryTrackerService", () => {
    let service: MapQueryTrackerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MapQueryTrackerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
