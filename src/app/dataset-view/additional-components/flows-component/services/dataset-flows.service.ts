import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    GetDatasetListFlowsQuery,
} from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    constructor(private datasetFlowApi: DatasetFlowApi, private toastrService: ToastrService) {}

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

    public datasetFlowsList(params: {
        datasetId: string;
        page: number;
        perPage: number;
        filters: DatasetFlowFilters;
    }): Observable<MaybeUndefined<FlowConnectionDataFragment>> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                return data.datasets.byId?.flows.runs.listFlows;
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
}
