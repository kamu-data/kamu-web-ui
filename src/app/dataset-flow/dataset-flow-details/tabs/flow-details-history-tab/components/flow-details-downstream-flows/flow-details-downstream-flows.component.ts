/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";

import { pluralize } from "@common/helpers/app.helpers";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import { FlowDownstreamLinkDataFragment } from "@api/kamu.graphql.interface";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DownstreamFlowItem } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/components/flow-details-downstream-flows/flow-details-downstream-flows.types";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-flow-details-downstream-flows",
    templateUrl: "./flow-details-downstream-flows.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgClass,
        NgFor,
        NgIf,
        RouterLink,
        //-----//
        MatIconModule,
        MatTooltipModule,
        //-----//
        DisplayDatasetIdPipe,
    ],
})
export class FlowDetailsDownstreamFlowsComponent {
    public items: DownstreamFlowItem[] = [];

    @Input({ required: true }) public set links(links: FlowDownstreamLinkDataFragment[]) {
        this.items = [...links]
            .sort(
                (a, b) => Date.parse(a.activatedAt) - Date.parse(b.activatedAt) || Number(a.flowId) - Number(b.flowId),
            )
            .map((link) => FlowDetailsDownstreamFlowsComponent.toItem(link));
    }

    public get title(): string {
        return `Initiated ${this.items.length} downstream ${pluralize("flow", this.items.length)}:`;
    }

    private static toItem(link: FlowDownstreamLinkDataFragment): DownstreamFlowItem {
        const dataset = link.dataset?.__typename === "DatasetAccessResultAccessible" ? link.dataset.dataset : null;
        const datasetLink = dataset ? ["/", dataset.owner.accountName, dataset.name] : null;
        const flow = dataset ? link.flow : null;
        return {
            flowId: link.flowId,
            icon: flow
                ? FlowTableHelpers.descriptionColumnTableOptions(flow)
                : { icon: dataset ? "radio_button_unchecked" : "help_outline", class: "text-muted" },
            flowLink:
                flow && datasetLink
                    ? [...datasetLink, ProjectLinks.URL_FLOW_DETAILS, link.flowId, FlowDetailsTabs.HISTORY]
                    : null,
            flowStatusDescription: flow
                ? `${FlowTableHelpers.flowTypeDescription(flow)} ${FlowTableHelpers.descriptionEndOfMessage(flow)}`
                : null,
            datasetLink,
            datasetAlias: dataset ? `${dataset.owner.accountName}/${dataset.name}` : null,
            unavailableDatasetId: dataset ? null : (link.datasetId ?? null),
        };
    }
}
