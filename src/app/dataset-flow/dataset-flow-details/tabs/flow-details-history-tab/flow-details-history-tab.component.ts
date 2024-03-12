import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import {
    DatasetByIdQuery,
    FlowEventInitiated,
    FlowHistoryDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowTriggerInputDatasetFlow,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsHistoryTabComponent extends BaseComponent implements OnInit {
    @Input() flowHistory: FlowHistoryDataFragment[];
    @Input() flowDetails: FlowSummaryDataFragment;
    public inputDatasetInfo: DatasetInfo = { accountName: "", datasetName: "" };
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;

    constructor(private datasetService: DatasetService, private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.setInputDatasetInfo();
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

    public flowEventSubMessage(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
        inputDatasetInfo: DatasetInfo,
    ): string {
        return DatasetFlowDetailsHelpers.flowEventSubMessage(flowEvent, flowDetails, inputDatasetInfo);
    }

    private setInputDatasetInfo(): void {
        const inputDatasetFlow = this.flowHistory.filter(
            (item: FlowHistoryDataFragment) =>
                item.__typename === "FlowEventInitiated" && item.trigger.__typename === "FlowTriggerInputDatasetFlow",
        );
        if (inputDatasetFlow.length) {
            const eventInitiated = inputDatasetFlow[0] as FlowEventInitiated;
            const datasetId = (eventInitiated.trigger as FlowTriggerInputDatasetFlow).datasetId;
            this.trackSubscription(
                this.datasetService.requestDatasetInfoById(datasetId).subscribe((dataset: DatasetByIdQuery) => {
                    if (dataset.datasets.byId) {
                        this.inputDatasetInfo = {
                            accountName: dataset.datasets.byId.owner.accountName,
                            datasetName: dataset.datasets.byId.name,
                        };
                        this.cdr.detectChanges();
                    }
                }),
            );
        }
    }
}
