/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, take } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

import AppValues from "@common/values/app.values";
import { DatasetFlowApi } from "@api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowTriggerRuleInput,
    FlowTriggerStopPolicyInput,
    GetDatasetFlowTriggerQuery,
    PauseDatasetFlowTriggerMutation,
    SetDatasetFlowTriggerMutation,
} from "@api/kamu.graphql.interface";
import { DatasetInfo } from "@interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowTriggerService {
    private readonly datasetFlowApi = inject(DatasetFlowApi);
    private readonly toastrService = inject(ToastrService);
    private readonly navigationService = inject(NavigationService);

    public fetchDatasetFlowTrigger(
        datasetId: string,
        datasetFlowType: DatasetFlowType,
    ): Observable<GetDatasetFlowTriggerQuery> {
        return this.datasetFlowApi.getDatasetFlowTrigger({ datasetId, datasetFlowType }).pipe(take(1));
    }

    public setDatasetFlowTrigger(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        triggerRuleInput: FlowTriggerRuleInput;
        triggerStopPolicyInput: FlowTriggerStopPolicyInput;
        datasetInfo: DatasetInfo;
    }): Observable<void> {
        return this.datasetFlowApi.setDatasetFlowTrigger(params).pipe(
            map((data: SetDatasetFlowTriggerMutation) => {
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

    public pauseDatasetFlowTrigger(params: { datasetId: string; datasetFlowType: DatasetFlowType }): Observable<void> {
        return this.datasetFlowApi.pauseDatasetFlowTrigger(params).pipe(
            map((_: PauseDatasetFlowTriggerMutation) => {
                this.toastrService.success("Success");
            }),
        );
    }
}
