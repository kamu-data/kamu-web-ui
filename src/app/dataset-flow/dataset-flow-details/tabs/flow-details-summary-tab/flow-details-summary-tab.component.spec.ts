import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsSummaryTabComponent } from "./flow-details-summary-tab.component";
import { mockTableFlowSummaryDataFragments } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.helpers.mock";
import moment from "moment";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import timekeeper from "timekeeper";

describe("FlowDetailsSummaryTabComponent", () => {
    let component: FlowDetailsSummaryTabComponent;
    let fixture: ComponentFixture<FlowDetailsSummaryTabComponent>;

    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
        moment.relativeTimeThreshold("s", 59);
        moment.relativeTimeThreshold("m", 59);
        moment.relativeTimeThreshold("h", 23);
        moment.tz.setDefault("Europe/Kiev");
    });

    afterAll(() => {
        moment.tz.setDefault();
    });

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
        expect(flowInitiatorElement?.textContent?.trim()).toEqual("System");

        const flowOutcomeElement = findElementByDataTestId(fixture, "flow-outcome") as HTMLSpanElement;
        expect(flowOutcomeElement?.textContent?.trim()).toEqual("SUCCESS");
        expect(flowOutcomeElement).toHaveClass("success-outcome");

        const flowCreatedTimeElement = findElementByDataTestId(fixture, "flow-created-time");
        expect(flowCreatedTimeElement?.textContent?.trim()).toEqual("2024-02-12, 8:22:30 PM");

        const flowRunningTimeElement = findElementByDataTestId(fixture, "flow-running-time");
        expect(flowRunningTimeElement?.textContent?.trim()).toEqual("2024-02-12, 8:22:31 PM");

        const flowFinishedTimeElement = findElementByDataTestId(fixture, "flow-finished-time");
        expect(flowFinishedTimeElement?.textContent?.trim()).toEqual("2024-02-12, 8:22:32 PM");
    });
});
