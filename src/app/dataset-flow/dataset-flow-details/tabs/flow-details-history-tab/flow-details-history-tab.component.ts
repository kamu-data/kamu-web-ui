import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import {
    FlowHistoryDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";
import { BaseComponent } from "src/app/common/base.component";
import { DataHelpers } from "src/app/common/data.helpers";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsHistoryTabComponent extends BaseComponent {
    @Input({ required: true }) flowHistory: FlowHistoryDataFragment[];
    @Input({ required: true }) flowDetails: FlowSummaryDataFragment;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;

    private loggedUserService = inject(LoggedUserService);

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public get history(): FlowHistoryDataFragment[] {
        return this.flowHistory.filter(
            (item) => !(item.__typename === "FlowEventTaskChanged" && item.taskStatus === TaskStatus.Queued),
        );
    }

    public flowEventDescription(flowEvent: FlowHistoryDataFragment, flowDetails: FlowSummaryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventDescription(flowEvent, flowDetails);
    }

    public flowEventIconOptions(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): { icon: string; class: string } {
        return DatasetFlowDetailsHelpers.flowEventIconOptions(flowEvent, flowDetails);
    }

    public durationFlowEvent(startEventTime: string, endEventTime: string): string {
        return DataHelpers.durationTask(startEventTime, endEventTime);
    }

    public flowEventSubMessage(flowEvent: FlowHistoryDataFragment, flowDetails: FlowSummaryDataFragment): string {
        return DatasetFlowDetailsHelpers.flowEventSubMessage(flowEvent, flowDetails);
    }

    public dynamicImgSrc(status: FlowStatus): string {
        return DatasetFlowDetailsHelpers.dynamicImgSrc(status);
    }
}
