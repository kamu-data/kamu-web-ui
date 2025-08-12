/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ComponentFixture } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";

import { FlowDetailsHistoryTabComponent } from "./flow-details-history-tab.component";
import { FlowDetailsHistoryTabHarness } from "./flow-details-history-tab.component.harness";
import { FlowStatus, TaskStatus } from "src/app/api/kamu.graphql.interface";
import {
    mockDatasetFlowByIdResponse,
    mockFlowHistoryDataFragment,
    mockFlowSummaryDataFragments,
} from "src/app/api/mock/dataset-flow.mock";

describe("FlowDetailsHistoryTabComponent", () => {
    let component: FlowDetailsHistoryTabComponent;
    let fixture: ComponentFixture<FlowDetailsHistoryTabComponent>;
    let loader: HarnessLoader;
    let harness: FlowDetailsHistoryTabHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlowDetailsHistoryTabComponent],
        }).compileComponents();
    });

    async function setupComponent(mockOverrides: object = {}) {
        fixture = TestBed.createComponent(FlowDetailsHistoryTabComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        const mockResponse = structuredClone(mockDatasetFlowByIdResponse);

        // Apply overrides to the mock response
        if (mockOverrides) {
            Object.assign(mockResponse, mockOverrides);
        }

        component.response = mockResponse;
        fixture.detectChanges();

        harness = await loader.getHarness(FlowDetailsHistoryTabHarness);
    }

    it("should create", async () => {
        await setupComponent();
        expect(component).toBeTruthy();
    });

    describe("Template rendering with different scenarios", () => {
        it("should render history items", async () => {
            await setupComponent();

            const itemCount = await harness.getHistoryItemsCount();
            expect(itemCount).toBeGreaterThan(0);
        });

        it("should render last item with running status showing animation image", async () => {
            await setupComponent({
                flow: {
                    ...mockFlowSummaryDataFragments[0],
                    status: FlowStatus.Running,
                },
            });

            const hasAnimationImage = await harness.hasAnimationImage();
            expect(hasAnimationImage).toBe(true);
        });

        it("should render last item with finished status without animation image", async () => {
            await setupComponent({
                flow: {
                    ...mockFlowSummaryDataFragments[0],
                    status: FlowStatus.Finished,
                },
            });

            const hasAnimationImage = await harness.hasAnimationImage();
            expect(hasAnimationImage).toBe(false);
        });

        it("should render correct event descriptions", async () => {
            await setupComponent();

            const itemCount = await harness.getHistoryItemsCount();
            if (itemCount > 0) {
                const firstDescription = await harness.getHistoryItemDescription(0);
                expect(firstDescription).toBeTruthy();
            }
        });

        it("should render correct event times", async () => {
            await setupComponent();

            const itemCount = await harness.getHistoryItemsCount();
            if (itemCount > 0) {
                const firstTime = await harness.getHistoryItemTime(0);
                expect(firstTime).toBeTruthy();
            }
        });

        it("should render appropriate icons for events", async () => {
            await setupComponent();

            const itemCount = await harness.getHistoryItemsCount();
            if (itemCount > 0) {
                const firstIcon = await harness.getHistoryItemIcon(0);
                expect(firstIcon).toBeTruthy();
                expect(firstIcon?.icon).toBeTruthy();
            }
        });
    });

    describe("History item filtering", () => {
        it("should skip queued tasks messages", async () => {
            await setupComponent({
                flowHistory: [
                    mockFlowHistoryDataFragment[0], // initiated
                    mockFlowHistoryDataFragment[1], // start condition updated
                    {
                        ...mockFlowHistoryDataFragment[2],
                        taskStatus: TaskStatus.Queued,
                    },
                    mockFlowHistoryDataFragment[2], // task changed to running
                ],
            });

            const itemCount = await harness.getHistoryItemsCount();
            expect(itemCount).toBe(3); // Should skip the queued task
            expect(await harness.getHistoryItemDescription(0)).toContain("Flow initiated automatically");
            expect(await harness.getHistoryItemDescription(1)).toContain("Waiting for free executor");
            expect(await harness.getHistoryItemDescription(2)).toContain("Polling ingest task running");
        });

        it("should skip empty batching condition items", async () => {
            await setupComponent({
                flowHistory: [
                    mockFlowHistoryDataFragment[0], // initiated
                    {
                        ...mockFlowHistoryDataFragment[1],
                        __typename: "FlowEventStartConditionUpdated",
                        startCondition: {
                            __typename: "FlowStartConditionReactive",
                            activeBatchingRule: { minRecordsToAwait: 0 },
                        },
                    }, // empty batching condition
                    mockFlowHistoryDataFragment[2], // task changed to running
                ],
            });

            const itemCount = await harness.getHistoryItemsCount();
            expect(itemCount).toBe(2); // Should skip the empty batching condition item
            expect(await harness.getHistoryItemDescription(0)).toContain("Flow initiated automatically");
            expect(await harness.getHistoryItemDescription(1)).toContain("Polling ingest task running");
        });

        it("should render non-empty batching condition items", async () => {
            await setupComponent({
                flowHistory: [
                    mockFlowHistoryDataFragment[0], // initiated
                    {
                        ...mockFlowHistoryDataFragment[1],
                        __typename: "FlowEventStartConditionUpdated",
                        startCondition: {
                            __typename: "FlowStartConditionReactive",
                            activeBatchingRule: { minRecordsToAwait: 100 },
                            batchingDeadline: mockFlowHistoryDataFragment[2].eventTime,
                            accumulatedRecordsCount: 200,
                            watermarkModified: false,
                        },
                    }, // non-empty batching condition
                    mockFlowHistoryDataFragment[2], // task changed to running
                ],
            });

            const itemCount = await harness.getHistoryItemsCount();
            expect(itemCount).toBe(3);
            expect(await harness.getHistoryItemDescription(0)).toContain("Flow initiated automatically");
            expect(await harness.getHistoryItemDescription(1)).toContain("Waiting for reactive condition");
            expect(await harness.getHistoryItemDescription(2)).toContain("Polling ingest task running");
        });
    });
});
