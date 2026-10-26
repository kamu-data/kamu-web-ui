/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ApplicationRef } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { GraphComponent, NgxGraphStates } from "@swimlane/ngx-graph";
import timekeeper from "timekeeper";
import type { Mock } from "vitest";

import { LineageGraphComponent } from "@common/components/lineage-graph/lineage-graph.component";
import { LineageGraphHarness } from "@common/components/lineage-graph/lineage-graph.harness";
import { MOCK_GRAPH_WITH_SOURCES, MOCK_SOURCE_NODES } from "@common/components/lineage-graph/lineage-graph.mock";
import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";
import {
    findComponentInstance,
    getElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { DatasetLineageBasicsFragment } from "@api/kamu.graphql.interface";
import {
    MOCK_CURRENT_DATASET_NODE,
    MOCK_INACCESSIBLE_NODE,
    MOCK_LINKS,
    MOCK_NODES,
    MOCK_OTHER_DATASET_NODE,
} from "@api/mock/dataset.mock";

import { mockGraphNode } from "src/app/dataset-view/additional-components/data-tabs.mock";
import {
    LineageGraph,
    LineageGraphNodeKind,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { SessionStorageService } from "src/app/services/session-storage.service";

describe("LineageGraphComponent", () => {
    let component: LineageGraphComponent;
    let fixture: ComponentFixture<LineageGraphComponent>;
    let harness: LineageGraphHarness;
    let widgetHeightService: WidgetHeightService;
    let sessionStorageService: SessionStorageService;
    let setSidePanelVisibleSpy: Mock;
    const FROZEN_TIME = new Date("2023-10-01 12:00:00");
    const MOCK_GRAPH: LineageGraph = { links: MOCK_LINKS, nodes: MOCK_NODES };

    const CURRENT_NODE = MOCK_CURRENT_DATASET_NODE;
    const OTHER_NODE = MOCK_OTHER_DATASET_NODE;
    const INACCESSIBLE_NODE = MOCK_INACCESSIBLE_NODE;

    // The fit leaves this much room on the left for the minimap, and on the right for an open side panel
    const MINIMAP_INSET = 110;
    const SIDE_PANEL_INSET = 280;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, LineageGraphComponent],
        }).compileComponents();

        widgetHeightService = TestBed.inject(WidgetHeightService);
        sessionStorageService = TestBed.inject(SessionStorageService);
        setSidePanelVisibleSpy = vi.spyOn(sessionStorageService, "setSidePanelVisible").mockImplementation(() => {});
    });

    interface RenderOptions {
        graph?: LineageGraph;
        currentDataset?: DatasetLineageBasicsFragment;
        sidePanelVisible?: boolean;
    }

    function create(options: RenderOptions = {}): void {
        vi.spyOn(sessionStorageService, "isSidePanelVisible", "get").mockReturnValue(options.sidePanelVisible ?? false);

        fixture = TestBed.createComponent(LineageGraphComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "graph", options.graph ?? MOCK_GRAPH);
        setComponentInput(fixture, "currentDataset", options.currentDataset ?? mockGraphNode);
        fixture.detectChanges();
    }

    async function render(options: RenderOptions = {}): Promise<void> {
        create(options);
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, LineageGraphHarness);
    }

    // ngx-graph schedules its first layout pass on a timer it does not cancel on destroy
    afterEach(async () => {
        await fixture.whenStable();
    });

    // Per test: a fakeAsync test restores the real Date when it ends, undoing the freeze
    beforeEach(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    afterEach(() => {
        timekeeper.reset();
    });

    describe("nodes", () => {
        beforeEach(async () => {
            await render();
        });

        it("should render a node for every dataset", async () => {
            expect(await harness.hasNode(LineageGraphNodeKind.Dataset, CURRENT_NODE.label ?? "")).toBe(true);
            expect(await harness.hasNode(LineageGraphNodeKind.Dataset, OTHER_NODE.label ?? "")).toBe(true);
            expect(
                await harness.hasNode(LineageGraphNodeKind.DatasetNotAccessable, INACCESSIBLE_NODE.label ?? ""),
            ).toBe(true);
        });

        it("should not emit a click on the current dataset", async () => {
            expect(CURRENT_NODE.data.dataObject.isCurrent).toBe(true);
            const onClickNodeEventSpy = vi.spyOn(component.onClickNodeEvent, "emit").mockImplementation(() => {});

            await harness.clickNode(LineageGraphNodeKind.Dataset, CURRENT_NODE.label ?? "");

            expect(onClickNodeEventSpy).not.toHaveBeenCalled();
        });

        it("should emit a click on another dataset", async () => {
            const onClickNodeEventSpy = vi.spyOn(component.onClickNodeEvent, "emit").mockImplementation(() => {});

            await harness.clickNode(LineageGraphNodeKind.Dataset, OTHER_NODE.label ?? "");

            expect(onClickNodeEventSpy).toHaveBeenCalledTimes(1);

            expect(onClickNodeEventSpy).toHaveBeenCalledWith(expect.objectContaining({ id: OTHER_NODE.id }));
        });

        it("should emit a private click on an inaccessible dataset", async () => {
            const onClickNodeEventSpy = vi.spyOn(component.onClickNodeEvent, "emit").mockImplementation(() => {});
            const onClickPrivateNodeEventSpy = vi
                .spyOn(component.onClickPrivateNodeEvent, "emit")
                .mockImplementation(() => {});

            await harness.clickNode(LineageGraphNodeKind.DatasetNotAccessable, INACCESSIBLE_NODE.label ?? "");

            expect(onClickPrivateNodeEventSpy).toHaveBeenCalledTimes(1);

            expect(onClickPrivateNodeEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({ id: INACCESSIBLE_NODE.id }),
            );
            expect(onClickNodeEventSpy).not.toHaveBeenCalled();
        });

        it("should mark private datasets with a lock icon", async () => {
            expect(await harness.hasPrivateIcon(CURRENT_NODE.label ?? "")).toBe(true);
            expect(await harness.hasPrivateIcon(INACCESSIBLE_NODE.label ?? "")).toBe(false);
        });

        it("should render the default avatar for an owner without one", () => {
            const avatarElement = getElementByDataTestId(
                fixture,
                `account-avatar-${CURRENT_NODE.label}`,
                SVGImageElement,
            );
            expect(avatarElement.getAttribute("xlink:href")).toEqual(AppValues.DEFAULT_AVATAR_URL);
        });
    });

    it("should render a node for every kind of source", async () => {
        await render({ graph: MOCK_GRAPH_WITH_SOURCES });

        for (const node of MOCK_SOURCE_NODES) {
            const kind = node.data.kind;
            expect(await harness.hasNode(kind, node.label ?? ""), kind).toBe(true);
        }
    });

    describe("side panel", () => {
        it("should toggle the side panel and remember the choice", async () => {
            await render();
            expect(await harness.isSidePanelShown()).toBe(false);

            await harness.toggleSidePanel();

            expect(await harness.isSidePanelShown()).toBe(true);
            expect(setSidePanelVisibleSpy).toHaveBeenCalledTimes(1);
            expect(setSidePanelVisibleSpy).toHaveBeenCalledWith(true);
        });

        it("should show a public dataset without a license", async () => {
            await render({ sidePanelVisible: true });

            expect(await harness.getSidePanelDetails()).toEqual({
                avatarUrl: mockGraphNode.owner.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL,
                dataset: `${mockGraphNode.owner.accountName} / ${mockGraphNode.name}`,
                access: "Public",
                kind: "Derivative",
                size: "14.2 KB estimated size",
                records: "127 records",
                license: "No  license",
                created: "26 days ago",
                updated: "26 days ago",
                watermark: "26 days ago",
            });
        });

        it("should show a private dataset with a license and no watermark", async () => {
            await render({
                sidePanelVisible: true,
                currentDataset: {
                    ...mockGraphNode,
                    visibility: { __typename: "PrivateDatasetVisibility" },
                    metadata: {
                        ...mockGraphNode.metadata,
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "MIT",
                            name: "MIT License",
                            spdxId: "MIT",
                            websiteUrl: "https://opensource.org/license/mit",
                        },
                        currentWatermark: null,
                    },
                } satisfies DatasetLineageBasicsFragment,
            });

            const details = await harness.getSidePanelDetails();
            expect(details.access).toEqual("Private");
            expect(details.license).toEqual("MIT license");
            expect(details.watermark).toBeNull();
        });
    });

    describe("view size", () => {
        it("should measure the view again when the window is resized", async () => {
            await render();
            const spyOnResize = vi.spyOn(component, "changeLineageGraphView");
            window.dispatchEvent(new Event("resize"));
            window.dispatchEvent(new Event("resize"));
            expect(spyOnResize).toHaveBeenCalledTimes(2);
        });

        it("should take the view height from the widget height", () => {
            const mockHeight = 1000;
            const widgetHeightSpy = vi.spyOn(widgetHeightService, "widgetHeight", "get").mockReturnValue(mockHeight);
            create();
            expect(component.view[1]).toEqual(mockHeight);
            expect(widgetHeightSpy).toHaveBeenCalledWith();
        });
    });

    it("should measure the view from its container once rendered", async () => {
        vi.spyOn(sessionStorageService, "isSidePanelVisible", "get").mockReturnValue(false);
        fixture = TestBed.createComponent(LineageGraphComponent);
        component = fixture.componentInstance;
        const changeViewSpy = vi.spyOn(component, "changeLineageGraphView");
        setComponentInput(fixture, "graph", MOCK_GRAPH);
        setComponentInput(fixture, "currentDataset", mockGraphNode);

        fixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();

        expect(changeViewSpy).toHaveBeenCalledWith();
        await fixture.whenStable();
    });

    describe("fitting the graph", () => {
        let graph: GraphComponent;
        let zoomSpy: Mock;
        let panToSpy: Mock;

        function layOut(viewWidth: number, graphWidth: number, graphHeight: number): void {
            graph = findComponentInstance(fixture, GraphComponent);
            graph.dims = { width: viewWidth, height: 500 };
            graph.graphDims = { width: graphWidth, height: graphHeight };
            graph.minimapOffsetX = -100;
            graph.minimapOffsetY = -50;
            vi.spyOn(graph, "zoomLevel", "get").mockReturnValue(1);
            zoomSpy = vi.spyOn(graph, "zoom").mockImplementation(() => {});
            panToSpy = vi.spyOn(graph, "panTo").mockImplementation(() => {});
            graph.stateChange.emit({ state: NgxGraphStates.Output });
        }

        it("should zoom out a wide graph into the space right of the minimap", async () => {
            await render();

            layOut(1000 + MINIMAP_INSET, 2000, 400);

            expect(zoomSpy).toHaveBeenCalledWith(0.5);
            // Graph centre (-100 + 2000 / 2, -50 + 400 / 2), moved left by half the minimap inset at zoom 0.5
            expect(panToSpy).toHaveBeenCalledWith(900 - MINIMAP_INSET, 150);
        });

        it("should never zoom in on a small graph", async () => {
            await render();

            layOut(1000 + MINIMAP_INSET, 400, 200);

            expect(zoomSpy).toHaveBeenCalledWith(1);
            expect(panToSpy).toHaveBeenCalledWith(100 - MINIMAP_INSET / 2, 50);
        });

        it("should leave room for the open side panel", async () => {
            await render({ sidePanelVisible: true });

            layOut(1000 + MINIMAP_INSET + SIDE_PANEL_INSET, 2000, 400);

            expect(zoomSpy).toHaveBeenCalledWith(0.5);
            expect(panToSpy).toHaveBeenCalledWith(900 + SIDE_PANEL_INSET - MINIMAP_INSET, 150);
        });

        it("should not zoom out below the minimum zoom level", async () => {
            await render();

            layOut(1000 + MINIMAP_INSET, 10000, 400);

            expect(zoomSpy).toHaveBeenCalledWith(0.3);
        });

        it("should keep the viewport on a pan or zoom", async () => {
            await render();
            graph = findComponentInstance(fixture, GraphComponent);
            zoomSpy = vi.spyOn(graph, "zoom").mockImplementation(() => {});

            graph.stateChange.emit({ state: NgxGraphStates.Transform });

            expect(zoomSpy).not.toHaveBeenCalled();
        });

        it("should re-render the minimap once ngx-graph has rescaled it", fakeAsync(() => {
            create();
            // Lets ngx-graph finish its own layout passes, which also mark its view for check
            flush();
            layOut(1000 + MINIMAP_INSET, 2000, 400);
            const markForCheckSpy = vi.spyOn(graph.cd, "markForCheck").mockImplementation(() => {});

            tick(499);
            expect(markForCheckSpy).not.toHaveBeenCalled();

            tick(1);
            expect(markForCheckSpy).toHaveBeenCalledWith();
            flush();
        }));
    });
});
