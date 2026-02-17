/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { FlowHistoryDataFragment, FlowStatus, FlowSummaryDataFragment, TaskStatus } from "@api/kamu.graphql.interface";
import { DataHelpers } from "@common/helpers/data.helpers";
import { SafeHtmlPipe } from "@common/pipes/safe-html.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        NgClass,
        DatePipe,
        //-----//
        MatDividerModule,
        MatIconModule,
        //-----//
        SafeHtmlPipe,
    ],
})
export class FlowDetailsHistoryTabComponent {
    @Input(RoutingResolvers.FLOW_DETAILS_HISTORY_KEY) public response: DatasetFlowByIdResponse;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;

    public get flowHistory(): FlowHistoryDataFragment[] {
        return this.response.flowHistory;
    }

    public get flowDetails(): FlowSummaryDataFragment {
        return this.response.flow;
    }

    public get currentTime(): string {
        return new Date().toISOString();
    }

    public get history(): FlowHistoryDataFragment[] {
        return this.flowHistory.filter(
            (item) =>
                !(item.__typename === "FlowEventTaskChanged" && item.taskStatus === TaskStatus.Queued) &&
                !this.isEmptyBatchingConditionItem(item),
        );
    }

    private isEmptyBatchingConditionItem(item: FlowHistoryDataFragment): boolean {
        return (
            item.__typename === "FlowEventStartConditionUpdated" &&
            item.startCondition.__typename === "FlowStartConditionReactive" &&
            item.startCondition.activeBatchingRule.__typename === "FlowTriggerBatchingRuleImmediate"
        );
    }

    public flowEventDescription(flowEvent: FlowHistoryDataFragment, flowDetails: FlowSummaryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventDescription(flowEvent, flowDetails);
    }

    public flowEventIconOptions(flowEvent: FlowHistoryDataFragment): { icon: string; class: string } {
        return DatasetFlowDetailsHelpers.flowEventIconOptions(flowEvent);
    }

    public durationFlowEvent(startEventTime: string, endEventTime: string): string {
        return DataHelpers.durationTask(startEventTime, endEventTime);
    }

    public flowEventSubMessage(flowEvent: FlowHistoryDataFragment, flowDetails: FlowSummaryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventSubMessage(flowEvent, flowDetails);
    }

    public flowStatusAnimationSrc(status: FlowStatus): string {
        return DatasetFlowDetailsHelpers.flowStatusAnimationSrc(status);
    }
}
