/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetFlowsTabResolver } from "./dataset-flows-tab.resolver";
import { Observable } from "rxjs";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

describe("datasetFlowsTabResolver", () => {
    const executeResolver: ResolveFn<Observable<DatasetOverviewTabData>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetFlowsTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
