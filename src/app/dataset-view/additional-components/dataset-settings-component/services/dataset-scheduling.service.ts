/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "./../../../../services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map, take } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    FlowTriggerInput,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersQuery,
    SetCompactionFlowConfigMutation,
    SetDatasetFlowTriggersMutation,
    SetIngestFlowConfigMutation,
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

    public setDatasetIngestFlowConfigs(params: {
        datasetId: string,
        ingestConfigInput: FlowConfigIngestInput
    }): Observable<boolean> {
        return this.datasetFlowApi.setDatasetFlowIngestConfig({
            datasetId: params.datasetId,
            ingestConfigInput: params.ingestConfigInput,
        }).pipe(
            map((data: SetIngestFlowConfigMutation) => {
                const setIngestConfig = data.datasets.byId?.flows.configs.setIngestConfig;
                if (setIngestConfig?.__typename === "SetFlowConfigSuccess") {
                    this.toastrService.success(setIngestConfig?.message);
                    return true;
                } else {
                    this.toastrService.error(setIngestConfig?.message);
                    return false;
                }
            }),
        );
    }

    public setDatasetCompactionFlowConfigs(params: {
        datasetId: string,
        compactionConfigInput: FlowConfigCompactionInput
    }): Observable<boolean> {
        return this.datasetFlowApi.setDatasetFlowCompactionConfig({
            datasetId: params.datasetId,
            compactionConfigInput: params.compactionConfigInput,
        }).pipe(
            map((data: SetCompactionFlowConfigMutation) => {
                const setCompactionConfig = data.datasets.byId?.flows.configs.setCompactionConfig;
                if (setCompactionConfig?.__typename === "SetFlowConfigSuccess") {
                    this.toastrService.success(setCompactionConfig?.message);
                    return true;
                } else {
                    this.toastrService.error(setCompactionConfig?.message);
                    return false;
                }
            }),
        );
    }    

    public fetchDatasetFlowTriggers(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowTriggersQuery> {
        return this.datasetFlowApi.getDatasetFlowTriggers({ datasetId, datasetFlowType }).pipe(take(1));
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
