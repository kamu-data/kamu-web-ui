import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsSummaryTabComponent } from "./flow-details-summary-tab.component";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import AppValues from "src/app/common/app.values";
import { mockTableFlowSummaryDataFragments } from "src/app/common/components/flows-table/flows-table.helpers.mock";

describe("FlowDetailsSummaryTabComponent", () => {
    let component: FlowDetailsSummaryTabComponent;
    let fixture: ComponentFixture<FlowDetailsSummaryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowDetailsSummaryTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsSummaryTabComponent);
        component = fixture.componentInstance;
        component.flowDetails = mockTableFlowSummaryDataFragments[5];
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
