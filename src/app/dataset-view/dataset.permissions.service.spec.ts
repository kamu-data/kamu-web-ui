/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetPermissionsService } from "./dataset.permissions.service";
import { mockFullPowerDatasetPermissionsFragment } from "../search/mock.data";

describe("DatasetPermissionsService", () => {
    let service: DatasetPermissionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetPermissionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("check settings appears if either rename or delete is allowed", () => {
        expect(service.shouldAllowSettingsTab(mockFullPowerDatasetPermissionsFragment)).toEqual(true);
    });

    it("check flows tab is allowed", () => {
        expect(service.shouldAllowFlowsTab(mockFullPowerDatasetPermissionsFragment)).toEqual(true);
    });
});
