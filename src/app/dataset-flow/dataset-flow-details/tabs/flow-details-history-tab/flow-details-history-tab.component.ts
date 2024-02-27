import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowHistoryDataFragment, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsHistoryTabComponent {
    @Input() flowHistory: FlowHistoryDataFragment[];
    @Input() flowDetails: FlowSummaryDataFragment;

    public flowEventDescription(flowEvent: FlowHistoryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventDescription(flowEvent);
    }

    public flowEventIconOptions(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): { icon: string; class: string } {
        return DatasetFlowDetailsHelpers.flowEventIconOptions(flowEvent, flowDetails);
    }

    public flowEventSubMessage(flowEvent: FlowHistoryDataFragment, flowDetails: FlowSummaryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventSubMessage(flowEvent, flowDetails);
    }
}
