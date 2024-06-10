import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    Account,
    CancelScheduledTasksMutation,
    Dataset,
    DatasetAllFlowsPausedQuery,
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    GetDatasetListFlowsQuery,
    GetFlowByIdQuery,
} from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import { FlowsTableData } from "../components/flows-table/flows-table.types";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    constructor(
        private datasetFlowApi: DatasetFlowApi,
        private toastrService: ToastrService,
    ) {}

    public datasetTriggerFlow(params: { datasetId: string; datasetFlowType: DatasetFlowType }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerFlow({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
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
        perPage: number;
        filters: DatasetFlowFilters;
    }): Observable<FlowsTableData> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                return {
                    connectionData: data.datasets.byId?.flows.runs.listFlows as FlowConnectionDataFragment,
                    involvedDatasets: [data.datasets.byId as Dataset],
                };
            }),
        );
    }

    public datasetPauseFlows(params: { datasetId: string; datasetFlowType?: DatasetFlowType }): Observable<void> {
        return this.datasetFlowApi.datasetPauseFlows(params).pipe(
            map((data: DatasetPauseFlowsMutation) => {
                const result = data.datasets.byId?.flows.configs.pauseFlows;
                result
                    ? this.toastrService.success("Flows paused")
                    : this.toastrService.error("Error, flows not paused");
            }),
        );
    }

    public datasetResumeFlows(params: { datasetId: string; datasetFlowType?: DatasetFlowType }): Observable<void> {
        return this.datasetFlowApi.datasetResumeFlows(params).pipe(
            map((data: DatasetResumeFlowsMutation) => {
                const result = data.datasets.byId?.flows.configs.resumeFlows;
                result
                    ? this.toastrService.success("Flows resumed")
                    : this.toastrService.error("Error, flows not resumed");
            }),
        );
    }

    public allFlowsPaused(datasetId: string): Observable<MaybeUndefined<boolean>> {
        return this.datasetFlowApi.allFlowsPaused(datasetId).pipe(
            map((data: DatasetAllFlowsPausedQuery) => {
                return data.datasets.byId?.flows.configs.allPaused;
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

    public flowsInitiators(datasetId: string): Observable<Account[]> {
        return this.datasetFlowApi.getDatasetFlowsInitiators(datasetId).pipe(
            map((data: DatasetFlowsInitiatorsQuery) => {
                return data.datasets.byId?.flows.runs.listFlowInitiators.nodes.sort((a, b) => {
                    if (a.accountName < b.accountName) return -1;
                    if (a.accountName > b.accountName) return 1;
                    return 0;
                }) as Account[];
            }),
        );
    }
}
