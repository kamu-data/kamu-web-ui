/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, NgClass, NgFor, NgIf, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import AppValues from "@common/values/app.values";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import {
    Dataset,
    DatasetBasicsFragment,
    FlowItemWidgetDataFragment,
    FlowStatus,
} from "src/app/api/kamu.graphql.interface";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

import { FlowTableHelpers } from "../flows-table/flows-table.helpers";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        DatePipe,
        NgFor,
        NgClass,
        NgIf,
        SlicePipe,
        //-----//
        NgbPopover,
    ],
})
export class TileBaseWidgetComponent {
    @Input({ required: true }) public nodes: FlowItemWidgetDataFragment[];
    @Input({ required: true }) public involvedDatasets: DatasetBasicsFragment[];
    @Input() public displayAlias: boolean = true;

    public readonly LAST_RUNS_COUNT = 150;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly URL_FLOW_DETAILS = ProjectLinks.URL_FLOW_DETAILS;
    public readonly DEFAULT_ADMIN_ACCOUNT_NAME = AppValues.DEFAULT_ADMIN_ACCOUNT_NAME;

    public flowTotalDuration(node: FlowItemWidgetDataFragment): string {
        return FlowTableHelpers.fullDurationTimingText(node);
    }

    public flowRunDuration(flowNode: FlowItemWidgetDataFragment): string {
        return FlowTableHelpers.runDurationTimingText(flowNode);
    }

    public tileWidgetClass(node: FlowItemWidgetDataFragment): string {
        return TileBaseWidgetHelpers.tileWidgetClass(node);
    }

    public tileOutcomeMessage(node: FlowItemWidgetDataFragment): string {
        if (!node.outcome) {
            return "-";
        }
        switch (node.outcome.__typename) {
            case "FlowSuccessResult":
                return "success";
            case "FlowFailedError":
                return "failed";
            case "FlowAbortedResult":
                return "aborted";
            /* istanbul ignore next */
            default:
                return "Unknown outcome typename";
        }
    }

    public datasetAliasByDescription(node: FlowItemWidgetDataFragment): string {
        if (node.datasetId) {
            const dataset = (this.involvedDatasets as Dataset[]).find(
                (dataset) => dataset.id === node.datasetId,
            ) as Dataset;
            return dataset?.alias || "";
        }
        return "";
    }

    private canonicalDatasetAlias(node: FlowItemWidgetDataFragment): string {
        const alias = this.datasetAliasByDescription(node);
        if (alias.includes("/")) {
            return alias;
        }
        return `${this.DEFAULT_ADMIN_ACCOUNT_NAME}/${alias}`;
    }

    public getTileItemLink(node: FlowItemWidgetDataFragment): string {
        return encodeURI(
            `${this.canonicalDatasetAlias(node)}/${this.URL_FLOW_DETAILS}/${node.flowId}/${FlowDetailsTabs.HISTORY}`,
        );
    }
}
