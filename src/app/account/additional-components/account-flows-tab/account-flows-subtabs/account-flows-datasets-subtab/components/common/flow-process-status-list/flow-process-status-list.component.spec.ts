/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowProcessStatusListComponent } from "./flow-process-status-list.component";
import { FLOW_PROCESS_STATE_LIST } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { FlowProcessEffectiveState } from "src/app/api/kamu.graphql.interface";

describe("FlowProcessStatusListComponent", () => {
    let component: FlowProcessStatusListComponent;
    let fixture: ComponentFixture<FlowProcessStatusListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowProcessStatusListComponent],
        });
        fixture = TestBed.createComponent(FlowProcessStatusListComponent);
        component = fixture.componentInstance;
        component.options = FLOW_PROCESS_STATE_LIST;
        component.filters = {
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
            applyFilters: true,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
