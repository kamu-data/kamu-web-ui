/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetMetadataTabResolverFn } from "./dataset-metadata-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

describe("datasetMetadataTabResolverFn", () => {
    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetMetadataTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
