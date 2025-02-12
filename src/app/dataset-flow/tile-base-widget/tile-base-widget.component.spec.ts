import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TileBaseWidgetComponent } from "./tile-base-widget.component";
import { mockFlowsOutcome, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { FlowOutcomeDataFragment } from "src/app/api/kamu.graphql.interface";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasets } from "../flows-table/flows-table.helpers.mock";

describe("TileBaseWidgetComponent", () => {
    let component: TileBaseWidgetComponent;
    let fixture: ComponentFixture<TileBaseWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileBaseWidgetComponent],
            imports: [NgbPopoverModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TileBaseWidgetComponent);
        component = fixture.componentInstance;
        component.nodes = mockFlowSummaryDataFragments;
        component.involvedDatasets = mockDatasets;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check flow's duration is not null", () => {
        const runningTime = mockFlowSummaryDataFragments[2].timing.runningSince;
        const finishedTime = mockFlowSummaryDataFragments[2].timing.finishedAt;
        const result = component.durationTask(runningTime, finishedTime);
        expect(result).toEqual("2 seconds");
    });

    it("should check flow's duration is null", () => {
        const runningTime = mockFlowSummaryDataFragments[4].timing.runningSince;
        const finishedTime = mockFlowSummaryDataFragments[4].timing.finishedAt;
        const result = component.durationTask(runningTime, finishedTime);
        expect(result).toEqual("-");
    });

    interface TestCase {
        case: FlowOutcomeDataFragment;
        expectedResult: string;
    }

    [
        { case: mockFlowsOutcome[0], expectedResult: "success" },
        { case: mockFlowsOutcome[1], expectedResult: "aborted" },
        { case: mockFlowsOutcome[2], expectedResult: "failed" },
    ].forEach((testCase: TestCase) => {
        it(`should check outcome message equal ${testCase.expectedResult}`, () => {
            expect(component.tileOutcomeMessage(testCase.case)).toEqual(testCase.expectedResult);
        });
    });

    it(`should check extract dataset alias`, () => {
        expect(component.datasetAliasByDescription(mockFlowSummaryDataFragments[0])).toEqual(mockDatasets[0].alias);
    });

    it(`should check href for tile element`, () => {
        const tileElement = findElementByDataTestId(fixture, "tile-element-0") as HTMLLinkElement;
        expect(tileElement.href.includes("kamu/account.tokens.transfers/flow-details/414/history")).toBeTrue();
    });
});
