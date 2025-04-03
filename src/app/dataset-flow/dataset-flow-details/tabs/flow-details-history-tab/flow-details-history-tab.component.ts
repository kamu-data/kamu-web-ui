/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    FlowHistoryDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";
import { BaseComponent } from "src/app/common/components/base.component";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetFlowByIdResponse, FlowDetailsTabs } from "../../dataset-flow-details.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { timer, skip, filter, tap } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-flow-details-history-tab",
    templateUrl: "./flow-details-history-tab.component.html",
    styleUrls: ["./flow-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsHistoryTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.FLOW_DETAILS_HISTORY_KEY) public response: DatasetFlowByIdResponse;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public ngOnInit(): void {
        timer(0, 5000)
            .pipe(
                skip(1),
                filter(() => Boolean(this.flowDetails.status !== FlowStatus.Finished)),
                tap(() => {
                    this.navigationService.navigateToFlowDetails({
                        ...this.datasetInfo,
                        flowId: this.flowDetails.flowId,
                        tab: FlowDetailsTabs.HISTORY,
                    });
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private navigationService = inject(NavigationService);

    public readonly FlowStatus: typeof FlowStatus = FlowStatus;

    public get flowHistory(): FlowHistoryDataFragment[] {
        return this.response.flowHistory;
    }

    public get flowDetails(): FlowSummaryDataFragment {
        return this.response.flow;
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
