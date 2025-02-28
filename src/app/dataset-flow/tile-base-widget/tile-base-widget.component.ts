/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull, MaybeNullOrUndefined } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    Dataset,
    DatasetListFlowsDataFragment,
    FlowDescription,
    FlowItemWidgetDataFragment,
    FlowOutcomeDataFragment,
    FlowStatus,
} from "src/app/api/kamu.graphql.interface";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import AppValues from "src/app/common/values/app.values";
import ProjectLinks from "src/app/project-links";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    @Input({ required: true }) public nodes: FlowItemWidgetDataFragment[];
    @Input() public involvedDatasets: DatasetListFlowsDataFragment[] = [];

    public readonly LAST_RUNS_COUNT = 150;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly URL_FLOW_DETAILS = ProjectLinks.URL_FLOW_DETAILS;
    public readonly DEFAULT_ADMIN_ACCOUNT_NAME = AppValues.DEFAULT_ADMIN_ACCOUNT_NAME;

    public durationTask(d1: MaybeNullOrUndefined<string>, d2: MaybeNullOrUndefined<string>): string {
        if (!d2 || !d1) return "-";
        return DataHelpers.durationTask(d1, d2);
    }

    public tileWidgetClass(node: FlowItemWidgetDataFragment): string {
        return TileBaseWidgetHelpers.tileWidgetClass(node);
    }

    public tileOutcomeMessage(outcome: FlowOutcomeDataFragment): string {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (outcome.__typename) {
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
        const datasetId = this.extractDatasetId(node);
        if (datasetId) {
            const dataset = (this.involvedDatasets as Dataset[]).find((dataset) => dataset.id === datasetId) as Dataset;
            return dataset.alias;
        }
        return "";
    }

    public prefixAccountName(node: FlowItemWidgetDataFragment): string {
        if (this.datasetAliasByDescription(node).includes("/")) {
            return this.datasetAliasByDescription(node);
        }
        return `${this.DEFAULT_ADMIN_ACCOUNT_NAME}/${this.datasetAliasByDescription(node)}`;
    }

    public setTileItemLink(node: FlowItemWidgetDataFragment): string {
        return encodeURI(
            `${this.prefixAccountName(node)}/${this.URL_FLOW_DETAILS}/${node.flowId}/${FlowDetailsTabs.HISTORY}`,
        );
    }

    private extractDatasetId(node: FlowItemWidgetDataFragment): MaybeNull<string> {
        const description = node.description as FlowDescription;
        switch (description.__typename) {
            case "FlowDescriptionDatasetExecuteTransform":
            case "FlowDescriptionDatasetHardCompaction":
            case "FlowDescriptionDatasetPollingIngest":
            case "FlowDescriptionDatasetPushIngest":
            case "FlowDescriptionDatasetReset":
                return description.datasetId;
            default:
                return null;
        }
    }
}
