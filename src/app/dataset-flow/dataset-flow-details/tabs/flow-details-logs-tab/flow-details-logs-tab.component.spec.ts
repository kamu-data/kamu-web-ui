/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsLogsTabComponent } from "./flow-details-logs-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";
import { AppConfigService } from "src/app/app-config.service";

describe("FlowDetailsLogsTabComponent", () => {
    let component: FlowDetailsLogsTabComponent;
    let fixture: ComponentFixture<FlowDetailsLogsTabComponent>;
    let loggedUserService: LoggedUserService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, HttpClientTestingModule, MatIconModule, FlowDetailsLogsTabComponent],
            providers: [Apollo],
        });
        loggedUserService = TestBed.inject(LoggedUserService);

        fixture = TestBed.createComponent(FlowDetailsLogsTabComponent);
        appConfigService = TestBed.inject(AppConfigService);
        component = fixture.componentInstance;
        component.flowDetails = mockDatasetFlowByIdResponse;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check grafanaTaskDetailsURL getter with value", () => {
        spyOnProperty(appConfigService, "grafanaLogs", "get").and.returnValue({ taskDetailsUrl: "mock-value" });
        expect(component.grafanaTaskDetailsURL).toEqual("mock-value");
    });

    it("should check grafanaTaskDetailsURL getter with null", () => {
        spyOnProperty(appConfigService, "grafanaLogs", "get").and.returnValue(null);
        expect(component.grafanaTaskDetailsURL).toEqual("");
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
