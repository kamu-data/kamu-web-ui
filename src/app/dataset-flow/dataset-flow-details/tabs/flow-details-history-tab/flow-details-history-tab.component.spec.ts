/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsHistoryTabComponent } from "./flow-details-history-tab.component";
import { mockFlowHistoryDataFragment, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";

describe("FlowDetailsHistoryTabComponent", () => {
    let component: FlowDetailsHistoryTabComponent;
    let fixture: ComponentFixture<FlowDetailsHistoryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlowDetailsHistoryTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsHistoryTabComponent);
        component = fixture.componentInstance;
        component.response = {
            flow: mockFlowSummaryDataFragments[2],
            flowHistory: mockFlowHistoryDataFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
