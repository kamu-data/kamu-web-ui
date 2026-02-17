/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";
import AppValues from "@common/values/app.values";

import { FlowDetailsSummaryTabComponent } from "./flow-details-summary-tab.component";
import { FlowDetailsSummaryTabHarness } from "./flow-details-summary-tab.component.harness";

describe("FlowDetailsSummaryTabComponent", () => {
    let component: FlowDetailsSummaryTabComponent;
    let fixture: ComponentFixture<FlowDetailsSummaryTabComponent>;
    let loader: HarnessLoader;
    let harness: FlowDetailsSummaryTabHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlowDetailsSummaryTabComponent],
        }).compileComponents();
    });

    async function setupComponent(mockOverrides: object = {}) {
        fixture = TestBed.createComponent(FlowDetailsSummaryTabComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        const mockResponse = structuredClone(mockDatasetFlowByIdResponse);

        // Apply overrides to the mock response
        if (mockOverrides) {
            Object.assign(mockResponse.flow, mockOverrides);
        }

        component.response = mockResponse;
        fixture.detectChanges();

        harness = await loader.getHarness(FlowDetailsSummaryTabHarness);
    }

    it("should create", async () => {
        await setupComponent();
        expect(component).toBeTruthy();
    });

    describe("Outcome display conditions", () => {
        it("should render success outcome when outcome is present", async () => {
            await setupComponent({
                outcome: { __typename: "FlowSuccessResult" },
            });

            const outcome = await harness.getOutcome();
            expect(outcome).not.toBeNull();
            expect(outcome?.text).toEqual("SUCCESS");
            expect(await harness.hasOutcomeCssClass("completed-status")).toBe(true);
        });

        it("should render failed outcome when outcome is present", async () => {
            await setupComponent({
                outcome: { __typename: "FlowFailedError" },
            });

            const outcome = await harness.getOutcome();
            expect(outcome).not.toBeNull();
            expect(outcome?.text).toEqual("FAILED");
            expect(await harness.hasOutcomeCssClass("failed-status")).toBe(true);
        });

        it("should render aborted outcome when outcome is present", async () => {
            await setupComponent({
                outcome: { __typename: "FlowAbortedResult" },
            });

            const outcome = await harness.getOutcome();
            expect(outcome).not.toBeNull();
            expect(outcome?.text).toEqual("ABORTED");
            expect(await harness.hasOutcomeCssClass("aborted-outcome")).toBe(true);
        });

        it("should not render outcome element when outcome is null", async () => {
            await setupComponent({
                outcome: null,
            });

            expect(await harness.hasOutcomeElement()).toBe(false);
        });
    });

    describe("Retry policy display conditions", () => {
        it("should render retry policy section when retryPolicy is present", async () => {
            await setupComponent({
                retryPolicy: { maxAttempts: 3 },
                taskIds: ["task-1", "task-2"], // 2 tasks = 1 retry attempt
            });

            expect(await harness.hasRetryPolicySection()).toBe(true);
            const retryAttempts = await harness.getRetryAttempts();
            expect(retryAttempts).toEqual("1 of 3 times");
        });

        it("should not render retry policy section when retryPolicy is null", async () => {
            await setupComponent({
                retryPolicy: null,
            });

            expect(await harness.hasRetryPolicySection()).toBe(false);
        });
    });

    describe("Finished time display conditions", () => {
        it("should render finished time when both outcome and lastAttemptFinishedAt are present", async () => {
            await setupComponent({
                outcome: { __typename: "FlowSuccessResult" },
                timing: {
                    initiatedAt: "2024-01-01T10:00:00Z",
                    lastAttemptFinishedAt: "2024-01-01T10:30:00Z",
                },
            });

            expect(await harness.hasFinishedTimeElement()).toBe(true);
            const finishedTime = await harness.getFinishedTime();
            expect(finishedTime).not.toEqual("-");
            expect(finishedTime).toContain("2024-01-01");
        });

        it("should not render finished time element when outcome is present but lastAttemptFinishedAt is null", async () => {
            await setupComponent({
                outcome: { __typename: "FlowSuccessResult" },
                timing: {
                    initiatedAt: "2024-01-01T10:00:00Z",
                    lastAttemptFinishedAt: null,
                },
            });

            expect(await harness.hasFinishedTimeElement()).toBe(false);
        });

        it("should not render finished time element when outcome is null", async () => {
            await setupComponent({
                outcome: null,
                timing: {
                    initiatedAt: "2024-01-01T10:00:00Z",
                    lastAttemptFinishedAt: "2024-01-01T10:30:00Z",
                },
            });

            expect(await harness.hasFinishedTimeElement()).toBe(false);
        });
    });

    describe("Basic field rendering", () => {
        it("should render flow status", async () => {
            await setupComponent();

            const flowStatus = await harness.getFlowStatus();
            expect(flowStatus).toBeTruthy();
        });

        it("should render flow initiator with default value when initiator is null", async () => {
            await setupComponent({
                initiator: null,
            });

            const flowInitiator = await harness.getFlowInitiator();
            expect(flowInitiator).toEqual(AppValues.DEFAULT_FLOW_INITIATOR);
        });

        it("should render flow initiated time", async () => {
            await setupComponent();

            const flowInitiatedTime = await harness.getFlowInitiatedTime();
            expect(flowInitiatedTime).toBeTruthy();
        });

        it("should render flow running duration", async () => {
            await setupComponent();

            const flowRunDuration = await harness.getFlowRunDuration();
            expect(flowRunDuration).toBeTruthy();
        });

        it("should render flow total time", async () => {
            await setupComponent();

            const flowTotalTime = await harness.getFlowTotalTime();
            expect(flowTotalTime).toBeTruthy();
        });

        it("should render all basic fields", async () => {
            await setupComponent();

            expect(await harness.hasAllBasicFields()).toBe(true);
        });
    });
});
