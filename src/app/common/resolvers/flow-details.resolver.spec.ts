/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { flowDetailsResolver } from "./flow-details.resolver";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { MaybeNull } from "src/app/interface/app.types";

describe("flowDetailsResolver", () => {
    const executeResolver: ResolveFn<MaybeNull<DatasetFlowByIdResponse>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
