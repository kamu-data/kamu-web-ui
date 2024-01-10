import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import {
    GetDatasetBatchingQuery,
    GetDatasetIngestScheduleQuery,
    ScheduleInput,
    SetConfigBatchingMutation,
    SetConfigScheduleMutation,
    TimeDeltaInput,
} from "src/app/api/kamu.graphql.interface";
import { SchedulingApi } from "src/app/api/scheduling.api";

@Injectable({
    providedIn: "root",
})
export class DatasetSchedulingService {
    constructor(private schedulingApi: SchedulingApi, private toastrService: ToastrService) {}

    public fetchDatasetIngestSchedule(datasetId: string): Observable<GetDatasetIngestScheduleQuery> {
        return this.schedulingApi.getDatasetIngestSchedule(datasetId);
    }

    public fetchDatasetBatching(datasetId: string): Observable<GetDatasetBatchingQuery> {
        return this.schedulingApi.getDatasetBatching(datasetId);
    }

    public setConfigSchedule(params: {
        datasetId: string;
        paused: boolean;
        schedule: ScheduleInput;
    }): Observable<void> {
        return this.schedulingApi.setConfigSchedule(params).pipe(
            map((data: SetConfigScheduleMutation) => {
                const typename = data.datasets.byId?.flows.configs.setConfigSchedule.__typename;
                const message = data.datasets.byId?.flows.configs.setConfigSchedule.message;
                if (typename === "SetFlowConfigSuccess") {
                    this.toastrService.success(message);
                } else if (typename === "FlowIncompatibleDatasetKind") {
                    this.toastrService.error(message);
                }
            }),
        );
    }

    public setConfigBatching(params: {
        datasetId: string;
        paused: boolean;
        throttlingPeriod: TimeDeltaInput;
        minimalDataBatch: number;
    }): Observable<void> {
        return this.schedulingApi.setConfigBatching(params).pipe(
            map((data: SetConfigBatchingMutation) => {
                const typename = data.datasets.byId?.flows.configs.setConfigBatching.__typename;
                const message = data.datasets.byId?.flows.configs.setConfigBatching.message;
                if (typename === "SetFlowConfigSuccess") {
                    this.toastrService.success(message);
                } else if (typename === "FlowIncompatibleDatasetKind") {
                    this.toastrService.error(message);
                }
            }),
        );
    }
}
