/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsSummaryTabComponent } from "./flow-details-summary-tab.component";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import AppValues from "src/app/common/values/app.values";
import { mockTableFlowSummaryDataFragments } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";

describe("FlowDetailsSummaryTabComponent", () => {
    let component: FlowDetailsSummaryTabComponent;
    let fixture: ComponentFixture<FlowDetailsSummaryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [FlowDetailsSummaryTabComponent],
}).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsSummaryTabComponent);
        component = fixture.componentInstance;
        const mockResponse = structuredClone(mockDatasetFlowByIdResponse);
        mockResponse.flow = mockTableFlowSummaryDataFragments[5];
        component.response = mockResponse;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check render data", () => {
        const flowTypeElement = findElementByDataTestId(fixture, "flow-type");
        expect(flowTypeElement?.textContent?.trim()).toEqual("Polling ingest");

        const flowStatusElement = findElementByDataTestId(fixture, "flow-status");
        expect(flowStatusElement?.textContent?.trim()).toEqual("Finished");

        const flowInitiatorElement = findElementByDataTestId(fixture, "flow-initiator");
        expect(flowInitiatorElement?.textContent?.trim()).toEqual(AppValues.DEFAULT_FLOW_INITIATOR);

        const flowOutcomeElement = findElementByDataTestId(fixture, "flow-outcome") as HTMLSpanElement;
        expect(flowOutcomeElement?.textContent?.trim()).toEqual("SUCCESS");
        expect(flowOutcomeElement).toHaveClass("completed-status");
    });
});
