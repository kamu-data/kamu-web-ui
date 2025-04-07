/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Params, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetInfoResolver } from "./dataset-info.resolver";
import { DatasetInfo } from "src/app/interface/navigation.interface";

describe("datasetInfoResolver", () => {
    const executeResolver: ResolveFn<DatasetInfo> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetInfoResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check activeTabResolver", async () => {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            params: {
                accountName: "mockAccountName",
                datasetName: "mockDatasetName",
            } as Params,
        } as ActivatedRouteSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual({
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
        });
    });
});
