/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    FlowHistoryDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetFlowByIdResponse } from "../../dataset-flow-details.types";
import { SafeHtmlPipe } from "../../../../common/pipes/safe-html.pipe";
import { MatIconModule } from "@angular/material/icon";
import { NgFor, NgIf, NgClass, DatePipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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
            (item) => !(item.__typename === "FlowEventTaskChanged" && item.taskStatus === TaskStatus.Queued),
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
