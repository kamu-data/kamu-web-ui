/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TileBaseWidgetComponent } from "./tile-base-widget.component";
import { mockFlowItemWidgetDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { FlowItemWidgetDataFragment } from "src/app/api/kamu.graphql.interface";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasets } from "../flows-table/flows-table.helpers.mock";

describe("TileBaseWidgetComponent", () => {
    let component: TileBaseWidgetComponent;
    let fixture: ComponentFixture<TileBaseWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileBaseWidgetComponent],
            imports: [NgbPopoverModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TileBaseWidgetComponent);
        component = fixture.componentInstance;
        component.nodes = mockFlowItemWidgetDataFragments;
        component.involvedDatasets = mockDatasets;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check flow's duration of finished flow", () => {
        const result = component.flowDuration(mockFlowItemWidgetDataFragments[0]);
        expect(result).toEqual("1 minute 4 seconds");
    });

    it("should check flow's duration of aborted flow", () => {
        const result = component.flowDuration(mockFlowItemWidgetDataFragments[3]);
        expect(result).toEqual("-");
    });

    it("should check flow's duration of failed flow", () => {
        const result = component.flowDuration(mockFlowItemWidgetDataFragments[4]);
        expect(result).toEqual("4 seconds");
    });

    it("should check flow's duration of running flow", () => {
        const now = new Date();
        const widgetData = {
            ...mockFlowItemWidgetDataFragments[1],
            timing: {
                initiatedAt: new Date(now.getTime() - 100000).toISOString(), // 100 seconds ago
                scheduledAt: new Date(now.getTime() - 80000).toISOString(), // 80 seconds ago
                awaitingExecutorSince: new Date(now.getTime() - 80000).toISOString(), // 80 seconds ago
                runningSince: new Date(now.getTime() - 40000).toISOString(), // 40 seconds ago
                lastAttemptFinishedAt: null, // still running
            },
        };
        const result = component.flowDuration(widgetData);
        expect(result).toEqual("1 minute 40 seconds");
    });

    interface TestCase {
        case: FlowItemWidgetDataFragment;
        expectedResult: string;
    }

    [
        { case: mockFlowItemWidgetDataFragments[0], expectedResult: "success" },
        { case: mockFlowItemWidgetDataFragments[3], expectedResult: "aborted" },
        { case: mockFlowItemWidgetDataFragments[4], expectedResult: "failed" },
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
