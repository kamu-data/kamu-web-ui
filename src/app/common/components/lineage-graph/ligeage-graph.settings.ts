/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MiniMapPosition } from "@swimlane/ngx-graph";

export const LINEAGE_CONFIG: LineageGraphConfig = {
    layout: "dagre",
    enableDrag: false,
    enablePan: true,
    zoomEnabled: true,
    zoomSpeed: 0.03,
    minZoomLevel: 0.3,
    maxZoomLevel: 4.0,
    panOnZoom: true,
    showMiniMap: true,
    miniMapMaxWidth: 100,
    nodeHeight: 70,
    miniMapPosition: MiniMapPosition.UpperLeft,
    sidePanelWidth: 270,
    overlayGap: 10,
};

// Horizontal offsets inside a node box, shared by the node templates and the node size calculation
export const LINEAGE_NODE_LAYOUT = {
    padding: 10,
    datasetLabelX: 10,
    datasetAccountX: 35,
    sourceLabelX: 35,
    wideIconLabelX: 55,
    inaccessibleLabelX: 12,
} as const;

export interface LineageGraphConfig {
    layout: string;
    enableDrag: boolean;
    enablePan: boolean;
    zoomEnabled: boolean;
    zoomSpeed: number;
    minZoomLevel: number;
    maxZoomLevel: number;
    panOnZoom: boolean;
    showMiniMap: boolean;
    miniMapMaxWidth: number;
    nodeHeight: number;
    miniMapPosition: MiniMapPosition;
    sidePanelWidth: number;
    // Space kept between the graph and the minimap or side panel drawn over it
    overlayGap: number;
}
