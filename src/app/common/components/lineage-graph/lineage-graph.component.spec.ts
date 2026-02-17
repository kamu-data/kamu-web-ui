/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { mockGraphNode } from "src/app/dataset-view/additional-components/data-tabs.mock";
import timekeeper from "timekeeper";

import { LineageGraphComponent } from "@common/components/lineage-graph/lineage-graph.component";
import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { MOCK_LINKS, MOCK_NODES } from "@api/mock/dataset.mock";

describe("LineageGraphComponent", () => {
    let component: LineageGraphComponent;
    let fixture: ComponentFixture<LineageGraphComponent>;
    let widgetHeightService: WidgetHeightService;
    const FROZEN_TIME = new Date("2023-10-01 12:00:00");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, SharedTestModule, LineageGraphComponent],
        })
            .overrideComponent(LineageGraphComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(LineageGraphComponent);
        component = fixture.componentInstance;
        widgetHeightService = TestBed.inject(WidgetHeightService);
        component.graph = { links: MOCK_LINKS, nodes: MOCK_NODES };
        component.currentDataset = mockGraphNode;
        fixture.detectChanges();
    });

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should trigger checkWindowSize method when window is resized", () => {
        const spyOnResize = spyOn(component, "changeLineageGraphView").and.callThrough();
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("resize"));
        expect(spyOnResize).toHaveBeenCalledTimes(2);
    });

    it("should check click on node", () => {
        const onClickNodeEventSpy = spyOn(component.onClickNodeEvent, "emit");
        component.onClickNode(MOCK_NODES[0]);
        expect(onClickNodeEventSpy).toHaveBeenCalledWith(MOCK_NODES[0]);
    });

    it("should check click on private node", () => {
        const onClickPrivateNodeEventSpy = spyOn(component.onClickPrivateNodeEvent, "emit");
        component.onClickPrivateNode(MOCK_NODES[2]);
        expect(onClickPrivateNodeEventSpy).toHaveBeenCalledWith(MOCK_NODES[2]);
    });

    it("should check render default account avatar", () => {
        const label: string = MOCK_NODES[0].label ?? "bad";
        const avatarElement = findElementByDataTestId(fixture, `account-avatar-${label}`);

        expect(avatarElement).toBeDefined();
        expect(avatarElement?.getAttribute("xlink:href")).toEqual(AppValues.DEFAULT_AVATAR_URL);
    });

    it("should check switch the side panel", () => {
        expect(component).toBeTruthy();
        emitClickOnElementByDataTestId(fixture, "info-button");
        expect(component.showSidePanel).toBeTrue();
    });

    it("should check side panel content", () => {
        component.showSidePanel = true;
        fixture.detectChanges();

        const avatarUrl = findElementByDataTestId(fixture, "side-panel-avatar") as HTMLImageElement;
        expect(avatarUrl.src).toEqual(mockGraphNode.owner.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL);

        const dataset = findElementByDataTestId(fixture, "side-panel-dataset");
        expect(dataset?.textContent?.trim()).toEqual(`${mockGraphNode.owner.accountName} / ${mockGraphNode.name}`);

        const kind = findElementByDataTestId(fixture, "side-panel-dataset-kind");
        expect(kind?.textContent?.trim()).toEqual("Derivative");

        const size = findElementByDataTestId(fixture, "side-panel-dataset-size");
        expect(size?.textContent?.trim()).toEqual("14.2 KB estimated size");

        const records = findElementByDataTestId(fixture, "side-panel-dataset-records");
        expect(records?.textContent?.trim()).toEqual("127 records");

        const license = findElementByDataTestId(fixture, "side-panel-dataset-license");
        expect(license?.textContent?.trim()).toEqual("No  license");

        const createdDate = findElementByDataTestId(fixture, "side-panel-dataset-created");
        expect(createdDate?.textContent?.trim()).toEqual("26 days ago");

        const updatedDate = findElementByDataTestId(fixture, "side-panel-dataset-updated");
        expect(updatedDate?.textContent?.trim()).toEqual("26 days ago");

        const watermark = findElementByDataTestId(fixture, "side-panel-dataset-watermark");
        expect(watermark?.textContent?.trim()).toEqual("26 days ago");
    });

    it("should check height for the lineage graph", () => {
        const mockHeight = 1000;
        const widgetHeightSpy = spyOnProperty(widgetHeightService, "widgetHeight").and.returnValue(mockHeight);
        component.ngOnInit();
        expect(component.view[1]).toEqual(mockHeight);
        expect(widgetHeightSpy).toHaveBeenCalledWith();
    });
});
