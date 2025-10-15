/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { FlowsSelectionStateService } from "./flows-selection-state.service";

describe("FlowsSelectionStateService", () => {
    let service: FlowsSelectionStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FlowsSelectionStateService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
