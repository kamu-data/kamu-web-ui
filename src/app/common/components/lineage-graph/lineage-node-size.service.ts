/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { from, map, Observable } from "rxjs";

import { NodeDimension } from "@swimlane/ngx-graph";

import { LINEAGE_CONFIG, LINEAGE_NODE_LAYOUT } from "@common/components/lineage-graph/ligeage-graph.settings";
import { MaybeNull } from "@interface/app.types";

import { LineageGraphNodeKind } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

const LABEL_FONT_WEIGHT = 600;
const TEXT_FONT_WEIGHT = 400;

/**
 * Sizes lineage nodes from their texts, so that ngx-graph keeps the given dimensions instead of measuring
 * the rendered nodes. It measures the minimap copies as well, whose text browsers size inconsistently at
 * the minimap's scale.
 */
@Injectable({
    providedIn: "root",
})
export class LineageNodeSizeService {
    private context: MaybeNull<CanvasRenderingContext2D> = null;

    /** Emits once the page fonts have loaded, so that text is measured in the font it renders with */
    public whenFontsReady(): Observable<void> {
        return from(document.fonts.ready).pipe(map(() => undefined));
    }

    public datasetNodeSize(datasetName: string, accountName: string): NodeDimension {
        return this.nodeSize(
            Math.max(
                LINEAGE_NODE_LAYOUT.datasetLabelX + this.textWidth(datasetName, LABEL_FONT_WEIGHT),
                LINEAGE_NODE_LAYOUT.datasetAccountX + this.textWidth(accountName, TEXT_FONT_WEIGHT),
            ),
        );
    }

    public inaccessibleNodeSize(displayedId: string): NodeDimension {
        return this.nodeSize(LINEAGE_NODE_LAYOUT.inaccessibleLabelX + this.textWidth(displayedId, LABEL_FONT_WEIGHT));
    }

    public sourceNodeSize(kind: LineageGraphNodeKind, label: string): NodeDimension {
        const labelX =
            kind === LineageGraphNodeKind.EthereumLogs || kind === LineageGraphNodeKind.PushSource
                ? LINEAGE_NODE_LAYOUT.wideIconLabelX
                : LINEAGE_NODE_LAYOUT.sourceLabelX;
        return this.nodeSize(labelX + this.textWidth(label, TEXT_FONT_WEIGHT));
    }

    private nodeSize(contentWidth: number): NodeDimension {
        return {
            width: Math.ceil(contentWidth + LINEAGE_NODE_LAYOUT.padding),
            height: LINEAGE_CONFIG.nodeHeight,
        };
    }

    private textWidth(text: string, fontWeight: number): number {
        const context = this.canvasContext();
        // Node texts inherit the page font
        const { fontSize, fontFamily } = getComputedStyle(document.body);
        context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        return context.measureText(text).width;
    }

    private canvasContext(): CanvasRenderingContext2D {
        this.context ??= document.createElement("canvas").getContext("2d");
        if (!this.context) {
            throw new Error("Canvas 2D context is not available to measure lineage node texts");
        }
        return this.context;
    }
}
