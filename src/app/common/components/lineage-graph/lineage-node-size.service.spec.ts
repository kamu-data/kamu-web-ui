/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom } from "rxjs";

import { LINEAGE_CONFIG, LINEAGE_NODE_LAYOUT } from "@common/components/lineage-graph/ligeage-graph.settings";
import { LineageNodeSizeService } from "@common/components/lineage-graph/lineage-node-size.service";

import { LineageGraphNodeKind } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

describe("LineageNodeSizeService", () => {
    let service: LineageNodeSizeService;

    const LONG_NAME = "covid19.british-columbia.case-details.hm";
    const SHORT_NAME = "a.b";
    const LONG_ACCOUNT = "an-account-with-a-very-long-name-indeed";

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageNodeSizeService);
    });

    it("should emit once the fonts are ready", async () => {
        await expectAsync(firstValueFrom(service.whenFontsReady())).toBeResolved();
    });

    it("should give every node the configured height", () => {
        expect(service.datasetNodeSize(LONG_NAME, "kamu").height).toEqual(LINEAGE_CONFIG.nodeHeight);
        expect(service.inaccessibleNodeSize(LONG_NAME).height).toEqual(LINEAGE_CONFIG.nodeHeight);
        expect(service.sourceNodeSize(LineageGraphNodeKind.Source, LONG_NAME).height).toEqual(
            LINEAGE_CONFIG.nodeHeight,
        );
    });

    it("should size a dataset by its name in bold when the name is the longer text", () => {
        // Both measure the name in bold, and only the offset of the name differs
        expect(
            service.inaccessibleNodeSize(LONG_NAME).width - service.datasetNodeSize(LONG_NAME, "kamu").width,
        ).toEqual(LINEAGE_NODE_LAYOUT.inaccessibleLabelX - LINEAGE_NODE_LAYOUT.datasetLabelX);
    });

    it("should size a dataset by its account when the account is the longer text", () => {
        expect(service.datasetNodeSize(SHORT_NAME, LONG_ACCOUNT).width).toEqual(
            service.datasetNodeSize("b.c", LONG_ACCOUNT).width,
        );
        expect(service.datasetNodeSize(SHORT_NAME, LONG_ACCOUNT).width).toBeGreaterThan(
            service.datasetNodeSize(SHORT_NAME, "kamu").width,
        );
    });

    it("should leave room for the wider icon of Ethereum and push sources", () => {
        const source = service.sourceNodeSize(LineageGraphNodeKind.Source, LONG_NAME).width;
        expect(service.sourceNodeSize(LineageGraphNodeKind.Mqtt, LONG_NAME).width).toEqual(source);
        expect(service.sourceNodeSize(LineageGraphNodeKind.EthereumLogs, LONG_NAME).width - source).toEqual(
            LINEAGE_NODE_LAYOUT.wideIconLabelX - LINEAGE_NODE_LAYOUT.sourceLabelX,
        );
        expect(service.sourceNodeSize(LineageGraphNodeKind.PushSource, LONG_NAME).width - source).toEqual(
            LINEAGE_NODE_LAYOUT.wideIconLabelX - LINEAGE_NODE_LAYOUT.sourceLabelX,
        );
    });

    it("should measure a name as wide as an SVG text renders it", () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("font-weight", "600");
        text.textContent = LONG_NAME;
        svg.appendChild(text);
        document.body.appendChild(svg);
        const renderedWidth = text.getBBox().width;
        svg.remove();

        const measuredWidth =
            service.datasetNodeSize(LONG_NAME, "kamu").width -
            LINEAGE_NODE_LAYOUT.datasetLabelX -
            LINEAGE_NODE_LAYOUT.padding;
        expect(Math.abs(measuredWidth - renderedWidth)).toBeLessThanOrEqual(1);
    });
});
