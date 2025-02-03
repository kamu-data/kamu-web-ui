import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowOutcomeDataFragment, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { DatasetFlowDetailsHelpers } from "../flow-details-history-tab/flow-details-history-tab.helpers";

@Component({
    selector: "app-flow-details-summary-tab",
    templateUrl: "./flow-details-summary-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsSummaryTabComponent {
    @Input({ required: true }) public flowDetails: FlowSummaryDataFragment;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

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
