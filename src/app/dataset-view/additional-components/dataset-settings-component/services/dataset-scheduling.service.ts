import { NavigationService } from "./../../../../services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowConfigurationInput,
    FlowTriggerInput,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersQuery,
    SetDatasetFlowConfigMutation,
    SetDatasetFlowTriggersMutation,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetSchedulingService {
    private datasetFlowApi = inject(DatasetFlowApi);
    private toastrService = inject(ToastrService);
    private navigationService = inject(NavigationService);

    public fetchDatasetFlowConfigs(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowConfigsQuery> {
        return this.datasetFlowApi.getDatasetFlowConfigs({ datasetId, datasetFlowType });
    }

    public setDatasetFlowConfigs(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        configInput: FlowConfigurationInput;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowConfigs(params).pipe(
            map((data: SetDatasetFlowConfigMutation) => {
                const setConfig = data.datasets.byId?.flows.configs.setConfig;
                if (setConfig?.__typename === "SetFlowConfigSuccess") {
                    this.toastrService.success("Configuration saved");
                } else {
                    this.toastrService.error(setConfig?.message);
                }
            }),
        );
    }

    public fetchDatasetFlowTriggers(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowTriggersQuery> {
        return this.datasetFlowApi.getDatasetFlowTriggers({ datasetId, datasetFlowType });
    }

    public setDatasetTriggers(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        triggerInput: FlowTriggerInput;
        datasetInfo: DatasetInfo;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowTriggers(params).pipe(
            map((data: SetDatasetFlowTriggersMutation) => {
                const triggers = data.datasets.byId?.flows.triggers.setTrigger;
                if (triggers?.__typename === "SetFlowTriggerSuccess") {
                    setTimeout(() => {
                        this.navigationService.navigateToDatasetView({
                            accountName: params.datasetInfo.accountName,
                            datasetName: params.datasetInfo.datasetName,
                            tab: DatasetViewTypeEnum.Flows,
                        });
                    }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                } else {
                    this.toastrService.error(triggers?.message);
                }
            }),
        );
    }

    // public setDatasetFlowSchedule(params: {
    //     accountId: string;
    //     datasetId: string;
    //     datasetFlowType: DatasetFlowType;
    //     paused: boolean;
    //     ingest: IngestConditionInput;
    //     datasetInfo: DatasetInfo;
    // }): Observable<void> {
    //     return this.datasetFlowApi.setDatasetFlowSchedule(params).pipe(
    //         map((data: DatasetFlowScheduleMutation) => {
    //             const setConfigSchedule = data.datasets.byId?.flows.configs.setConfigIngest;
    //             if (setConfigSchedule?.__typename === "SetFlowConfigSuccess") {
    //                 setTimeout(() => {
    //                     this.navigationService.navigateToDatasetView({
    //                         accountName: params.datasetInfo.accountName,
    //                         datasetName: params.datasetInfo.datasetName,
    //                         tab: DatasetViewTypeEnum.Flows,
    //                     });
    //                 }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
    //             } else if (setConfigSchedule?.__typename === "FlowIncompatibleDatasetKind") {
    //                 this.toastrService.error(setConfigSchedule.message);
    //             }
    //         }),
    //     );
    // }

    // public setDatasetFlowBatching(params: {
    //     accountId: string;
    //     datasetId: string;
    //     datasetFlowType: DatasetFlowType;
    //     paused: boolean;
    //     transform: TransformConditionInput;
    //     datasetInfo: DatasetInfo;
    // }): Observable<void> {
    //     return this.datasetFlowApi.setDatasetFlowBatching(params).pipe(
    //         map((data: DatasetFlowBatchingMutation) => {
    //             const setConfigBatching = data.datasets.byId?.flows.configs.setConfigTransform;
    //             setConfigBatching?.__typename === "SetFlowConfigSuccess"
    //                 ? setTimeout(() => {
    //                       this.navigationService.navigateToDatasetView({
    //                           accountName: params.datasetInfo.accountName,
    //                           datasetName: params.datasetInfo.datasetName,
    //                           tab: DatasetViewTypeEnum.Flows,
    //                       });
    //                   }, AppValues.SIMULATION_START_CONDITION_DELAY_MS)
    //                 : this.toastrService.error(setConfigBatching?.message);
    //         }),
    //     );
    // }
}
