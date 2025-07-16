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
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";

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
            Object.assign(mockResponse.flow, mockOverrides);
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
                status: FlowStatus.Running,
            });

            const hasAnimationImage = await harness.hasAnimationImage();
            expect(hasAnimationImage).toBe(true);
        });

        it("should render last item with finished status without animation image", async () => {
            await setupComponent({
                status: FlowStatus.Finished,
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
});
