/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetCollaborationsService } from "./dataset-collaborations.service";

describe("DatasetCollaborationsService", () => {
    let service: DatasetCollaborationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetCollaborationsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
