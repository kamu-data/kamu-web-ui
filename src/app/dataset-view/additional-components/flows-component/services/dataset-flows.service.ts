import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, map, of } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    CurrentSourceFetchUrlFragment,
    DatasetAllFlowsPausedQuery,
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetMetadata,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    FetchStep,
    FetchStepUrl,
    FlowConnectionDataFragment,
    GetDatasetListFlowsQuery,
} from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import { FlowsTableData } from "../components/flows-table/flows-table.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    constructor(private datasetFlowApi: DatasetFlowApi, private toastrService: ToastrService) {}

    private fetchUrlChanges$: Subject<string> = new Subject<string>();

    public get fetchUrlChanges(): Observable<string> {
        return this.fetchUrlChanges$.asObservable();
    }

    public emitFetchUrlChanges(url: string): void {
        this.fetchUrlChanges$.next(url);
    }

    public datasetFlowsList(params: {
        datasetId: string;
        page: number;
        perPage: number;
        filters: DatasetFlowFilters;
    }): Observable<FlowsTableData> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                const metadata = data.datasets.byId?.metadata as DatasetMetadata;
                return {
                    connectionData: data.datasets.byId?.flows.runs.listFlows as FlowConnectionDataFragment,
                    source: metadata.currentPollingSource?.fetch,
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
}
