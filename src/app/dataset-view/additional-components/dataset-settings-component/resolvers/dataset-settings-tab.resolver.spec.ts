/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

import { datasetSettingsTabResolverFn } from "./dataset-settings-tab.resolver";

describe("datasetSettingsTabResolverFn", () => {
    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
