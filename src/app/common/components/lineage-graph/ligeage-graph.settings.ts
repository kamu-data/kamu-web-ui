/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MiniMapPosition } from "@swimlane/ngx-graph";

export const LINEAGE_CONFIG: LineageGraphConfig = {
    layout: "dagre",
    draggingEnabled: false,
    panningEnabled: true,
    zoomEnabled: true,
    zoomSpeed: 0.03,
    minZoomLevel: 0.3,
    maxZoomLevel: 4.0,
    panOnZoom: true,
    autoZoom: true,
    autoCenter: true,
    showMiniMap: true,
    nodeHeight: 70,
    miniMapPosition: MiniMapPosition.UpperLeft,
};

export interface LineageGraphConfig {
    layout: string;
    draggingEnabled: boolean;
    panningEnabled: boolean;
    zoomEnabled: boolean;
    zoomSpeed: number;
    minZoomLevel: number;
    maxZoomLevel: number;
    panOnZoom: boolean;
    autoZoom: boolean;
    autoCenter: boolean;
    showMiniMap: boolean;
    nodeHeight: number;
    miniMapPosition: MiniMapPosition;
}
