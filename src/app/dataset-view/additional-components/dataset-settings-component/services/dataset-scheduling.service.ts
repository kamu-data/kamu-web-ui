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
import AppValues from "src/app/common/values/app.values";
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
    }): Observable<boolean> {
        return this.datasetFlowApi.setDatasetFlowConfigs(params).pipe(
            map((data: SetDatasetFlowConfigMutation) => {
                const setConfig = data.datasets.byId?.flows.configs.setConfig;
                if (setConfig?.__typename === "SetFlowConfigSuccess") {
                    return true;
                } else {
                    this.toastrService.error(setConfig?.message);
                    return false;
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
}
