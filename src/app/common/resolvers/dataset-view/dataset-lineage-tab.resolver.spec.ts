/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetLineageTabResolver } from "./dataset-lineage-tab.resolver";
import { LineageGraphUpdate } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { MaybeNull } from "src/app/interface/app.types";

describe("datasetLineageTabResolver", () => {
    const executeResolver: ResolveFn<MaybeNull<LineageGraphUpdate>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetLineageTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
