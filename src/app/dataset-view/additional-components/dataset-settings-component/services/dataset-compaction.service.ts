/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetTriggerResetFlowMutation,
    FlowConfigCompactionInput,
    FlowConfigResetInput,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";

@Injectable({
    providedIn: "root",
})
export class DatasetCompactionService {
    private datasetFlowApi = inject(DatasetFlowApi);
    private toastrService = inject(ToastrService);
    private flowsService = inject(DatasetFlowsService);

    public runHardCompaction(params: {
        datasetId: string;
        compactionArgs: FlowConfigCompactionInput;
    }): Observable<boolean> {
        return this.flowsService.datasetTriggerCompactionFlow({
            datasetId: params.datasetId,
            compactionConfigInput: params.compactionArgs,
        });
    }

    public resetToSeed(params: { datasetId: string; resetArgs: FlowConfigResetInput }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerResetFlow({
                datasetId: params.datasetId,
                resetConfigInput: params.resetArgs,
            })
            .pipe(
                map((data: DatasetTriggerResetFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerResetFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerResetFlow.message);
                        return false;
                    }
                }),
            );
    }
}
