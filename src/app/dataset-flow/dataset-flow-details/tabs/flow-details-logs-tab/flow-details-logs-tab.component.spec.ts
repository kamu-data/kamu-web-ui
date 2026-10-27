/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { findElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { TaskStatus } from "@api/kamu.graphql.interface";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";

import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FlowDetailsLogsTabComponent } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-logs-tab/flow-details-logs-tab.component";

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
        setComponentInput(fixture, "flowDetails", mockDatasetFlowByIdResponse);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check grafanaTaskDetailsURL getter with value", () => {
        vi.spyOn(appConfigService, "grafanaLogs", "get").mockReturnValue({ taskDetailsUrl: "mock-value" });
        expect(component.grafanaTaskDetailsURL).toEqual("mock-value");
    });

    it("should check grafanaTaskDetailsURL getter with null", () => {
        vi.spyOn(appConfigService, "grafanaLogs", "get").mockReturnValue(null);
        expect(component.grafanaTaskDetailsURL).toEqual("");
    });

    it("should check grafana logs block is visible", () => {
        vi.spyOn(loggedUserService, "isAdmin", "get").mockReturnValue(true);
        vi.spyOn(component, "grafanaTaskDetailsURL", "get").mockReturnValue("http://mock.url");
        setComponentInput(fixture, "flowDetails", {
            ...mockDatasetFlowByIdResponse,
            flowHistory: [
                {
                    __typename: "FlowEventTaskChanged",
                    eventId: "3",
                    eventTime: "2024-03-13T13:54:32.269040795+00:00",
                    taskId: "0",
                    taskStatus: TaskStatus.Running,
                    task: { __typename: "Task", outcome: null },
                    nextAttemptAt: null,
                },
            ],
        });
        fixture.detectChanges();

        const grafanaLogsBlock = findElementByDataTestId(fixture, "grafana-logs-section");
        expect(grafanaLogsBlock).toBeDefined();
    });

    it("should check grafana logs block is not visible", () => {
        vi.spyOn(loggedUserService, "isAdmin", "get").mockReturnValue(false);
        vi.spyOn(component, "grafanaTaskDetailsURL", "get").mockReturnValue("http://mock.url");
        fixture.detectChanges();

        const grafanaLogsBlock = findElementByDataTestId(fixture, "grafana-logs-section");
        expect(grafanaLogsBlock).toBeUndefined();
    });
});
