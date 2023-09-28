import { MiniMapPosition } from "@swimlane/ngx-graph";

export const lineageConfig = {
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
    miniMapPosition: MiniMapPosition.UpperLeft,
};

export interface LineageGraphConfig {
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
    miniMapPosition: MiniMapPosition;
}
