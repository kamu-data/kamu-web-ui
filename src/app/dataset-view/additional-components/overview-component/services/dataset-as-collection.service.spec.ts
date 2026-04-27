/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { DatasetAsCollectionService } from "./dataset-as-collection.service";

describe("DatasetAsCollectionService", () => {
    let service: DatasetAsCollectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetAsCollectionService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
