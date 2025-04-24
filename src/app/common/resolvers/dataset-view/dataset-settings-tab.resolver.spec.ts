/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetSettingsTabResolver } from "./dataset-settings-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

describe("datasetSettingsTabResolver", () => {
    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
