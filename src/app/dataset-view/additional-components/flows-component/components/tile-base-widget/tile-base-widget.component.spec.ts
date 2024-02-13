import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TileBaseWidgetComponent } from "./tile-base-widget.component";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

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
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check flow's duration is not null", () => {
        const runningTime = mockFlowSummaryDataFragments[2].timing.runningSince;
        const finishedTime = mockFlowSummaryDataFragments[2].timing.finishedAt;
        const result = component.durationTask(runningTime, finishedTime);
        expect(result).toEqual("1 second");
    });

    it("should check flow's duration is null", () => {
        const runningTime = mockFlowSummaryDataFragments[0].timing.runningSince;
        const finishedTime = mockFlowSummaryDataFragments[0].timing.finishedAt;
        const result = component.durationTask(runningTime, finishedTime);
        expect(result).toEqual("-");
    });
});
