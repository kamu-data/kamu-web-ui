import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    BatchingConditionInput,
    DatasetFlowBatchingMutation,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    GetDatasetFlowConfigsQuery,
    ScheduleInput,
} from "src/app/api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetSchedulingService {
    constructor(private datasetFlowApi: DatasetFlowApi, private toastrService: ToastrService) {}

    public fetchDatasetFlowConfigs(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowConfigsQuery> {
        return this.datasetFlowApi.getDatasetFlowConfigs({ datasetId, datasetFlowType });
    }

    public setDatasetFlowSchedule(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        schedule: ScheduleInput;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowSchedule(params).pipe(
            map((data: DatasetFlowScheduleMutation) => {
                const setConfigSchedule = data.datasets.byId?.flows.configs.setConfigSchedule;
                if (setConfigSchedule?.__typename === "SetFlowConfigSuccess") {
                    this.toastrService.success(setConfigSchedule.message);
                } else if (setConfigSchedule?.__typename === "FlowIncompatibleDatasetKind") {
                    this.toastrService.error(setConfigSchedule.message);
                }
            }),
        );
    }

    public setDatasetFlowBatching(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        batching: BatchingConditionInput;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowBatching(params).pipe(
            map((data: DatasetFlowBatchingMutation) => {
                const setConfigBatching = data.datasets.byId?.flows.configs.setConfigBatching;
                setConfigBatching?.__typename === "SetFlowConfigSuccess"
                    ? this.toastrService.success(setConfigBatching.message)
                    : this.toastrService.error(setConfigBatching?.message);
            }),
        );
    }
}
