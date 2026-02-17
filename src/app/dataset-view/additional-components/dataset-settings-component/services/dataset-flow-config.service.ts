/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    FlowRetryPolicyInput,
    GetDatasetFlowConfigsQuery,
    SetCompactionFlowConfigMutation,
    SetIngestFlowConfigMutation,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowConfigService {
    private readonly datasetFlowApi = inject(DatasetFlowApi);
    private readonly toastrService = inject(ToastrService);

    public fetchDatasetFlowConfigs(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowConfigsQuery> {
        return this.datasetFlowApi.getDatasetFlowConfigs({ datasetId, datasetFlowType });
    }

    public setDatasetIngestFlowConfigs(params: {
        datasetId: string;
        ingestConfigInput: FlowConfigIngestInput;
        retryPolicyInput: MaybeNull<FlowRetryPolicyInput>;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .setDatasetFlowIngestConfig({
                datasetId: params.datasetId,
                ingestConfigInput: params.ingestConfigInput,
                retryPolicyInput: params.retryPolicyInput,
            })
            .pipe(
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
        datasetId: string;
        compactionConfigInput: FlowConfigCompactionInput;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .setDatasetFlowCompactionConfig({
                datasetId: params.datasetId,
                compactionConfigInput: params.compactionConfigInput,
            })
            .pipe(
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
}
