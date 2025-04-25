/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { flowDetailsActiveTabResolverFn } from "./flow-details-active-tab.resolver";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

describe("flowDetailsActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<FlowDetailsTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
