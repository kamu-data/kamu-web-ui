/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FlowOutcomeDataFragment, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { DatasetFlowDetailsHelpers } from "../flow-details-history-tab/flow-details-history-tab.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { timer, skip, filter, tap } from "rxjs";
import { DatasetFlowByIdResponse, FlowDetailsTabs } from "../../dataset-flow-details.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-flow-details-summary-tab",
    templateUrl: "./flow-details-summary-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsSummaryTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.FLOW_DETAILS_SUMMARY_KEY) public response: DatasetFlowByIdResponse;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    private navigationService = inject(NavigationService);

    public get flowDetails(): FlowSummaryDataFragment {
        return this.response.flow;
    }

    public ngOnInit(): void {
        timer(0, 5000)
            .pipe(
                skip(1),
                filter(() => Boolean(this.flowDetails.status !== FlowStatus.Finished)),
                tap(() => {
                    this.navigationService.navigateToFlowDetails({
                        ...this.datasetInfo,
                        flowId: this.flowDetails.flowId,
                        tab: FlowDetailsTabs.SUMMARY,
                    });
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
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
