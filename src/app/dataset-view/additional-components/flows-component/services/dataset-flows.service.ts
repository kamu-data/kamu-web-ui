/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    AccountFragment,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedQuery,
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetFlowsInitiatorsQuery,
    DatasetListFlowsDataFragment,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    FlowRunConfiguration,
    GetDatasetListFlowsQuery,
    GetFlowByIdQuery,
} from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MaybeUndefined } from "src/app/interface/app.types";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    private datasetFlowApi = inject(DatasetFlowApi);
    private toastrService = inject(ToastrService);
    private loggedUserService = inject(LoggedUserService);

    public datasetTriggerFlow(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        flowRunConfiguration?: FlowRunConfiguration;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerFlow({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                flowRunConfiguration: params.flowRunConfiguration,
            })
            .pipe(
                map((data: DatasetTriggerFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerFlow.message);
                        return false;
                    }
                }),
            );
    }

    public cancelScheduledTasks(params: { datasetId: string; flowId: string }): Observable<boolean> {
        return this.datasetFlowApi.cancelScheduledTasks(params).pipe(
            map((data: CancelScheduledTasksMutation) => {
                if (data.datasets.byId?.flows.runs.cancelScheduledTasks.__typename === "CancelScheduledTasksSuccess") {
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.flows.runs.cancelScheduledTasks.message);
                    return false;
                }
            }),
        );
    }

    public datasetFlowsList(params: {
        datasetId: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: DatasetFlowFilters;
    }): Observable<FlowsTableData> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                return {
                    connectionDataForTable: data.datasets.byId?.flows.runs.table as FlowConnectionDataFragment,
                    connectionDataForWidget: data.datasets.byId?.flows.runs.tiles as FlowConnectionDataFragment,
                    involvedDatasets: [data.datasets.byId] as DatasetListFlowsDataFragment[],
                };
            }),
        );
    }

    public datasetPauseFlows(params: { datasetId: string; datasetFlowType?: DatasetFlowType }): Observable<void> {
        return this.datasetFlowApi.datasetPauseFlows(params).pipe(
            map((data: DatasetPauseFlowsMutation) => {
                const result = data.datasets.byId?.flows.triggers.pauseFlows;
                result
                    ? this.toastrService.success("Flows paused")
                    : this.toastrService.error("Error, flows not paused");
            }),
        );
    }

    public datasetResumeFlows(params: { datasetId: string; datasetFlowType?: DatasetFlowType }): Observable<void> {
        return this.datasetFlowApi.datasetResumeFlows(params).pipe(
            map((data: DatasetResumeFlowsMutation) => {
                const result = data.datasets.byId?.flows.triggers.resumeFlows;
                result
                    ? this.toastrService.success("Flows resumed")
                    : this.toastrService.error("Error, flows not resumed");
            }),
        );
    }

    public allFlowsPaused(datasetId: string): Observable<MaybeUndefined<boolean>> {
        return this.datasetFlowApi.allFlowsPaused(datasetId).pipe(
            map((data: DatasetAllFlowsPausedQuery) => {
                return data.datasets.byId?.flows.triggers.allPaused;
            }),
        );
    }

    public datasetFlowById(params: {
        datasetId: string;
        flowId: string;
    }): Observable<MaybeUndefined<DatasetFlowByIdResponse>> {
        return this.datasetFlowApi.getFlowById(params).pipe(
            map((data: GetFlowByIdQuery) => {
                if (data.datasets.byId?.flows.runs.getFlow.__typename === "GetFlowSuccess") {
                    return {
                        flow: data.datasets.byId.flows.runs.getFlow.flow,
                        flowHistory: data.datasets.byId.flows.runs.getFlow.flow.history,
                    };
                } else if (data.datasets.byId?.flows.runs.getFlow.__typename === "FlowNotFound") {
                    this.toastrService.error(data.datasets.byId.flows.runs.getFlow.message);
                }
            }),
        );
    }

    public flowsInitiators(datasetId: string): Observable<AccountFragment[]> {
        return this.datasetFlowApi.getDatasetFlowsInitiators(datasetId).pipe(
            map((data: DatasetFlowsInitiatorsQuery) => {
                return data.datasets.byId?.flows.runs.listFlowInitiators.nodes.sort((a, b) => {
                    if (a.accountName < b.accountName) return -1;
                    if (a.accountName > b.accountName) return 1;
                    return 0;
                }) as AccountFragment[];
            }),
        );
    }
}
