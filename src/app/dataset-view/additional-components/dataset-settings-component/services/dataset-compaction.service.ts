import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map, of, switchMap } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    CompactionConditionInput,
    DatasetFlowCompactionMutation,
    DatasetFlowType,
    DatasetTriggerFlowMutation,
    FlowRunConfiguration,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";

@Injectable({
    providedIn: "root",
})
export class DatasetCompactionService {
    constructor(
        private datasetFlowApi: DatasetFlowApi,
        private toastrService: ToastrService,
        private flowsService: DatasetFlowsService,
    ) {}

    public runHardCompaction(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        compactionArgs: CompactionConditionInput;
    }): Observable<boolean> {
        return this.datasetFlowApi.setDatasetFlowCompaction(params).pipe(
            map((data: DatasetFlowCompactionMutation) => {
                if (data.datasets.byId?.flows.configs.setConfigCompaction.__typename === "SetFlowConfigSuccess") {
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.flows.configs.setConfigCompaction.message);
                    return false;
                }
            }),
            switchMap((success: boolean) => {
                if (success) {
                    return this.flowsService.datasetTriggerFlow({
                        datasetId: params.datasetId,
                        datasetFlowType: params.datasetFlowType,
                    });
                }
                return of(false);
            }),
        );
    }

    public resetToSeed(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        flowRunConfiguration: FlowRunConfiguration;
    }): Observable<boolean> {
        return this.datasetFlowApi.datasetTriggerFlow(params).pipe(
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
}
