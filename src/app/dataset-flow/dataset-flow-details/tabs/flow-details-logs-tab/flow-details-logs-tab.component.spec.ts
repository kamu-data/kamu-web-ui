import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsLogsTabComponent } from "./flow-details-logs-tab.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";

describe("FlowDetailsLogsTabComponent", () => {
    let component: FlowDetailsLogsTabComponent;
    let fixture: ComponentFixture<FlowDetailsLogsTabComponent>;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlowDetailsLogsTabComponent],
            imports: [SharedTestModule, HttpClientTestingModule, MatIconModule],
            providers: [Apollo],
        });
        loggedUserService = TestBed.inject(LoggedUserService);

        fixture = TestBed.createComponent(FlowDetailsLogsTabComponent);
        component = fixture.componentInstance;
        component.flowDetails = mockDatasetFlowByIdResponse;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check grafana logs block is visible", () => {
        spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(true);
        spyOnProperty(component, "grafanaTaskDetailsURL", "get").and.returnValue("http://mock.url");
        fixture.detectChanges();

        const grafanaLogsBlock = findElementByDataTestId(fixture, "grafana-logs-section");
        expect(grafanaLogsBlock).toBeDefined();
    });

    it("should check grafana logs block is not visible", () => {
        spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(false);
        spyOnProperty(component, "grafanaTaskDetailsURL", "get").and.returnValue("http://mock.url");
        fixture.detectChanges();

        const grafanaLogsBlock = findElementByDataTestId(fixture, "grafana-logs-section");
        expect(grafanaLogsBlock).toBeUndefined();
    });
});
