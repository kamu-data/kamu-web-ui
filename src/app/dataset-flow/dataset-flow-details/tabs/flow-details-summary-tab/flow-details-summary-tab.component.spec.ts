import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsSummaryTabComponent } from "./flow-details-summary-tab.component";

describe("FlowDetailsSummaryTabComponent", () => {
    let component: FlowDetailsSummaryTabComponent;
    let fixture: ComponentFixture<FlowDetailsSummaryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowDetailsSummaryTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsSummaryTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
