/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

import { datasetSettingsAccessTabResolverFn } from "./dataset-settings-access-tab.resolver";

describe("datasetSettingsAccessTabResolverFn", () => {
    const executeResolver: ResolveFn<DatasetViewData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsAccessTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
