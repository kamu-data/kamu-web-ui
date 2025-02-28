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
    CompactionConditionInput,
    DatasetFlowType,
    DatasetTriggerFlowMutation,
    FlowRunConfiguration,
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
        datasetFlowType: DatasetFlowType;
        compactionArgs: CompactionConditionInput;
    }): Observable<boolean> {
        return this.flowsService.datasetTriggerFlow({
            datasetId: params.datasetId,
            datasetFlowType: params.datasetFlowType,
            flowRunConfiguration: {
                compaction: params.compactionArgs,
            },
        });
    }

    public resetToSeed(params: {
        accountId: string;
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
