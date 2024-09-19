import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsLogsTabComponent } from "./flow-details-logs-tab.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("FlowDetailsLogsTabComponent", () => {
    let component: FlowDetailsLogsTabComponent;
    let fixture: ComponentFixture<FlowDetailsLogsTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlowDetailsLogsTabComponent],
            imports: [SharedTestModule, HttpClientTestingModule],
            providers: [Apollo],
        });
        fixture = TestBed.createComponent(FlowDetailsLogsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
