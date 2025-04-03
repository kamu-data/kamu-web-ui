/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { flowDetailsSummaryResolver } from "./flow-details-summary.resolver";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

describe("flowDetailsSummaryResolver", () => {
    const executeResolver: ResolveFn<DatasetFlowByIdResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsSummaryResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
