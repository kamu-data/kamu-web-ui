import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowOutcome, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/common/app.types";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-flow-details-summary-tab",
    templateUrl: "./flow-details-summary-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsSummaryTabComponent {
    @Input() flowDetails: FlowSummaryDataFragment;
    public readonly FlowOutcome: typeof FlowOutcome = FlowOutcome;

    public outcomeClass(flowOutcome: MaybeNullOrUndefined<FlowOutcome>): string {
        switch (flowOutcome) {
            case FlowOutcome.Success:
                return "finished-outcome";
            case FlowOutcome.Aborted:
                return "aborted-outcome";
            case FlowOutcome.Failed:
                return "failed-outcome";
            default:
                return "";
        }
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return DataHelpers.flowTypeDescription(flow);
    }

    public durationFlowEvent(startEventTime: string, endEventTime: string): string {
        return DataHelpers.durationTask(startEventTime, endEventTime);
    }
}
