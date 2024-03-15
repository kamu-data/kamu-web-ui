import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsHistoryTabComponent } from "./flow-details-history-tab.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { mockFlowHistoryDataFragment, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";

describe("FlowDetailsHistoryTabComponent", () => {
    let component: FlowDetailsHistoryTabComponent;
    let fixture: ComponentFixture<FlowDetailsHistoryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowDetailsHistoryTabComponent],
            imports: [MatDividerModule, MatIconModule, ApolloModule, ApolloTestingModule, SharedTestModule],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsHistoryTabComponent);
        component = fixture.componentInstance;
        component.flowHistory = mockFlowHistoryDataFragment;
        component.flowDetails = mockFlowSummaryDataFragments[2];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
