/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { DatasetPermissionsService } from "./dataset.permissions.service";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";

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
        expect(
            service.shouldAllowSettingsTab({
                permissions: {
                    canDelete: false,
                    canRename: true,
                },
            } as DatasetPermissionsFragment),
        ).toEqual(true);

        expect(
            service.shouldAllowSettingsTab({
                permissions: {
                    canDelete: true,
                    canRename: false,
                },
            } as DatasetPermissionsFragment),
        ).toEqual(true);

        expect(
            service.shouldAllowSettingsTab({
                permissions: {
                    canDelete: false,
                    canRename: false,
                },
            } as DatasetPermissionsFragment),
        ).toEqual(false);
    });

    it("check flows tab is allowed", () => {
        expect(
            service.shouldAllowFlowsTab({
                permissions: {
                    canDelete: false,
                    canRename: true,
                    canSchedule: true,
                },
            } as DatasetPermissionsFragment),
        ).toEqual(true);
    });
});
