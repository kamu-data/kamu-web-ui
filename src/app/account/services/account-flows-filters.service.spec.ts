/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { AccountFlowsFiltersService } from "./account-flows-filters.service";

describe("AccountFlowsFiltersService", () => {
    let service: AccountFlowsFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AccountFlowsFiltersService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
