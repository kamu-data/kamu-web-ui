/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, NgIf, TitleCasePipe, UpperCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { FlowOutcomeDataFragment, FlowSummaryDataFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-flow-details-summary-tab",
    templateUrl: "./flow-details-summary-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, UpperCasePipe, TitleCasePipe, DatePipe],
})
export class FlowDetailsSummaryTabComponent {
    @Input(RoutingResolvers.FLOW_DETAILS_SUMMARY_KEY) public response: DatasetFlowByIdResponse;

    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    public get flowDetails(): FlowSummaryDataFragment {
        return this.response.flow;
    }

    public outcomeClass(flowOutcome: FlowOutcomeDataFragment): string {
        return DatasetFlowDetailsHelpers.flowOutcomeOptions(flowOutcome).class;
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return FlowTableHelpers.flowTypeDescription(flow);
    }

    public flowFullDuration(): string {
        return FlowTableHelpers.fullDurationTimingText(this.flowDetails);
    }

    public flowRunDuration(): string {
        return FlowTableHelpers.runDurationTimingText(this.flowDetails);
    }

    public flowOutcomeMessage: Record<string, string> = {
        FlowSuccessResult: "success",
        FlowFailedError: "failed",
        FlowAbortedResult: "aborted",
    };
}
