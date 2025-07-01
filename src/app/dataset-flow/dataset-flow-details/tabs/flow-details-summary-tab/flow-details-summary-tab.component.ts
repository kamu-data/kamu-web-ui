/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowOutcomeDataFragment, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { DatasetFlowDetailsHelpers } from "../flow-details-history-tab/flow-details-history-tab.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetFlowByIdResponse } from "../../dataset-flow-details.types";
import { NgIf, UpperCasePipe, TitleCasePipe, DatePipe } from "@angular/common";

@Component({
    selector: "app-flow-details-summary-tab",
    templateUrl: "./flow-details-summary-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, UpperCasePipe, TitleCasePipe, DatePipe],
})
export class FlowDetailsSummaryTabComponent {
    @Input(RoutingResolvers.FLOW_DETAILS_SUMMARY_KEY) public response: DatasetFlowByIdResponse;

    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    public get flowDetails(): FlowSummaryDataFragment {
        return this.response.flow;
    }

    public outcomeClass(flowOutcome: FlowOutcomeDataFragment): string {
        return DatasetFlowDetailsHelpers.flowOutcomeOptions(flowOutcome).class;
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return DataHelpers.flowTypeDescription(flow);
    }

    public durationFlowEvent(startEventTime: string, endEventTime: string): string {
        return DataHelpers.durationTask(startEventTime, endEventTime);
    }

    public flowOutcomeMessage: Record<string, string> = {
        FlowSuccessResult: "success",
        FlowFailedError: "failed",
        FlowAbortedResult: "aborted",
    };
}
