/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FlowDetailsLogsTabComponent } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-logs-tab/flow-details-logs-tab.component";

import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";

describe("FlowDetailsLogsTabComponent", () => {
    let component: FlowDetailsLogsTabComponent;
    let fixture: ComponentFixture<FlowDetailsLogsTabComponent>;
    let loggedUserService: LoggedUserService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowDetailsLogsTabComponent],
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
