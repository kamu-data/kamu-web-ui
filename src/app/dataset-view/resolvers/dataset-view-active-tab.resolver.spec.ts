/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetViewActiveTabResolverFn } from "./dataset-view-active-tab.resolver";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

describe("datasetViewActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<DatasetViewTypeEnum> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetViewActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
