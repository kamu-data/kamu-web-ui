/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { accountFlowsResolverFn, AccountFlowsType } from "./account-flows.resolver";

describe("accountFlowsResolverFn", () => {
    const executeResolver: ResolveFn<AccountFlowsType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountFlowsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
