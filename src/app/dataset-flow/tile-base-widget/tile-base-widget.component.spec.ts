/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { FlowItemWidgetDataFragment } from "@api/kamu.graphql.interface";
import { mockFlowItemWidgetDataFragments } from "@api/mock/dataset-flow.mock";

import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { TileBaseWidgetComponent } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.component";

describe("TileBaseWidgetComponent", () => {
    let component: TileBaseWidgetComponent;
    let fixture: ComponentFixture<TileBaseWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TileBaseWidgetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TileBaseWidgetComponent);
        component = fixture.componentInstance;
        component.nodes = mockFlowItemWidgetDataFragments;
        component.involvedDatasets = mockDatasets;
        component.displayAlias = true;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check flow's duration of finished flow", () => {
        const runDuration = component.flowRunDuration(mockFlowItemWidgetDataFragments[0]);
        expect(runDuration).toEqual("4 seconds");

        const totalDuration = component.flowTotalDuration(mockFlowItemWidgetDataFragments[0]);
        expect(totalDuration).toEqual("1 minute 4 seconds");
    });

    it("should check flow's duration of aborted flow", () => {
        const runDuration = component.flowRunDuration(mockFlowItemWidgetDataFragments[3]);
        expect(runDuration).toEqual("-");

        const totalDuration = component.flowTotalDuration(mockFlowItemWidgetDataFragments[3]);
        expect(totalDuration).toEqual("-");
    });

    it("should check flow's duration of failed flow", () => {
        const runDuration = component.flowRunDuration(mockFlowItemWidgetDataFragments[4]);
        expect(runDuration).toEqual("3 seconds");

        const totalDuration = component.flowTotalDuration(mockFlowItemWidgetDataFragments[4]);
        expect(totalDuration).toEqual("4 seconds");
    });

    it("should check flow's duration and run time of retrying flow", () => {
        const initiationTime = new Date(new Date().getTime() - 60000); // 1 minute ago

        const flowNode = {
            ...mockFlowItemWidgetDataFragments[5],
            timing: {
                ...mockFlowItemWidgetDataFragments[5].timing,
                initiatedAt: initiationTime.toISOString(),
                firstAttemptScheduledAt: new Date(initiationTime.getTime() + 5000).toISOString(), // 5 seconds after initiation,
                scheduledAt: new Date(initiationTime.getTime() + 120000).toISOString(), // 2 minutes after initiation,
                awaitingExecutorSince: null,
                runningSince: null,
                lastAttemptFinishedAt: new Date(initiationTime.getTime() + 10000).toISOString(), // 10 seconds after initiation
            },
        } as FlowItemWidgetDataFragment;

        const runDuration = component.flowRunDuration(flowNode);
        expect(runDuration).toEqual("55 seconds");

        const totalDuration = component.flowTotalDuration(flowNode);
        expect(totalDuration).toEqual("1 minute");
    });

    it("should check flow's duration of failed flow that had retries", () => {
        const runDuration = component.flowRunDuration(mockFlowItemWidgetDataFragments[6]);
        expect(runDuration).toEqual("4 minutes 3 seconds");

        const totalDuration = component.flowTotalDuration(mockFlowItemWidgetDataFragments[6]);
        expect(totalDuration).toEqual("4 minutes 4 seconds");
    });

    it("should check flow's duration and total time of running flow", () => {
        const now = new Date();
        const widgetData = {
            ...mockFlowItemWidgetDataFragments[1],
            timing: {
                initiatedAt: new Date(now.getTime() - 100000).toISOString(), // 100 seconds ago
                firstAttemptScheduledAt: new Date(now.getTime() - 80000).toISOString(), // 80 seconds ago
                scheduledAt: new Date(now.getTime() - 80000).toISOString(), // 80 seconds ago
                awaitingExecutorSince: new Date(now.getTime() - 80000).toISOString(), // 80 seconds ago
                runningSince: new Date(now.getTime() - 40000).toISOString(), // 40 seconds ago
                lastAttemptFinishedAt: null, // still running
            },
        };

        const runDuration = component.flowRunDuration(widgetData);
        expect(runDuration).toEqual("1 minute 20 seconds");

        const totalTime = component.flowTotalDuration(widgetData);
        expect(totalTime).toEqual("1 minute 40 seconds");
    });

    interface TestCase {
        case: FlowItemWidgetDataFragment;
        expectedResult: string;
    }

    [
        { case: mockFlowItemWidgetDataFragments[0], expectedResult: "success" },
        { case: mockFlowItemWidgetDataFragments[3], expectedResult: "aborted" },
        { case: mockFlowItemWidgetDataFragments[4], expectedResult: "failed" },
        { case: mockFlowItemWidgetDataFragments[5], expectedResult: "-" },
    ].forEach((testCase: TestCase) => {
        it(`should check outcome message equal ${testCase.expectedResult}`, () => {
            expect(component.tileOutcomeMessage(testCase.case)).toEqual(testCase.expectedResult);
        });
    });

    it(`should check extract dataset alias`, () => {
        expect(component.datasetAliasByDescription(mockFlowItemWidgetDataFragments[0])).toEqual(mockDatasets[0].alias);
    });

    it(`should check href for tile element`, () => {
        const tileElement = findElementByDataTestId(fixture, "tile-element-0") as HTMLLinkElement;
        expect(tileElement.href.includes("kamu/account.tokens.transfers/flow-details/414/history")).toBeTrue();
    });
});
