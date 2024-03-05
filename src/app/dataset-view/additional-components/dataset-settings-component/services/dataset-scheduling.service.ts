import { NavigationService } from "./../../../../services/navigation.service";
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
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetSchedulingService {
    constructor(
        private datasetFlowApi: DatasetFlowApi,
        private toastrService: ToastrService,
        private navigationService: NavigationService,
    ) {}

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
        datasetInfo: DatasetInfo;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowSchedule(params).pipe(
            map((data: DatasetFlowScheduleMutation) => {
                const setConfigSchedule = data.datasets.byId?.flows.configs.setConfigSchedule;
                if (setConfigSchedule?.__typename === "SetFlowConfigSuccess") {
                    setTimeout(() => {
                        this.navigationService.navigateToDatasetView({
                            accountName: params.datasetInfo.accountName,
                            datasetName: params.datasetInfo.datasetName,
                            tab: DatasetViewTypeEnum.Flows,
                        });
                    }, 1000);
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
        datasetInfo: DatasetInfo;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowBatching(params).pipe(
            map((data: DatasetFlowBatchingMutation) => {
                const setConfigBatching = data.datasets.byId?.flows.configs.setConfigBatching;
                setConfigBatching?.__typename === "SetFlowConfigSuccess"
                    ? setTimeout(() => {
                          this.navigationService.navigateToDatasetView({
                              accountName: params.datasetInfo.accountName,
                              datasetName: params.datasetInfo.datasetName,
                              tab: DatasetViewTypeEnum.Flows,
                          });
                      }, 1000)
                    : this.toastrService.error(setConfigBatching?.message);
            }),
        );
    }
}
