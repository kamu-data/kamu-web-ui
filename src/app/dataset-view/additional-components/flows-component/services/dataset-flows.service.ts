/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { DatasetFlowApi } from "@api/dataset-flow.api";
import {
    AccountFragment,
    CancelFlowRunMutation,
    DatasetBasicsFragment,
    DatasetFlowFilters,
    DatasetFlowProcesses,
    DatasetFlowsInitiatorsQuery,
    DatasetFlowsProcessesQuery,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerCompactionFlowMutation,
    DatasetTriggerIngestFlowMutation,
    DatasetTriggerResetFlowMutation,
    DatasetTriggerResetToMetadataFlowMutation,
    DatasetTriggerTransformFlowMutation,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    FlowConfigResetInput,
    FlowConnectionDataFragment,
    FlowConnectionWidgetDataFragment,
    GetDatasetListFlowsQuery,
    GetFlowByIdQuery,
} from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    private datasetFlowApi = inject(DatasetFlowApi);
    private toastrService = inject(ToastrService);

    public datasetFlowsProcesses(params: { datasetId: string }): Observable<DatasetFlowProcesses> {
        return this.datasetFlowApi.getDatasetFlowsProcesses(params).pipe(
            map((data: DatasetFlowsProcessesQuery) => {
                return data.datasets.byId?.flows.processes as DatasetFlowProcesses;
            }),
        );
    }

    public datasetTriggerIngestFlow(params: {
        datasetId: string;
        ingestConfigInput?: FlowConfigIngestInput;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerIngestFlow({
                datasetId: params.datasetId,
                ingestConfigInput: params.ingestConfigInput,
            })
            .pipe(
                map((data: DatasetTriggerIngestFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerIngestFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerIngestFlow.message);
                        return false;
                    }
                }),
            );
    }

    public datasetTriggerTransformFlow(params: { datasetId: string }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerTransformFlow({
                datasetId: params.datasetId,
            })
            .pipe(
                map((data: DatasetTriggerTransformFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerTransformFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerTransformFlow.message);
                        return false;
                    }
                }),
            );
    }

    public datasetTriggerCompactionFlow(params: {
        datasetId: string;
        compactionConfigInput: FlowConfigCompactionInput;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerCompactionFlow({
                datasetId: params.datasetId,
                compactionConfigInput: params.compactionConfigInput,
            })
            .pipe(
                map((data: DatasetTriggerCompactionFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerCompactionFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerCompactionFlow.message);
                        return false;
                    }
                }),
            );
    }

    public datasetTriggerResetToMetadataFlow(params: { datasetId: string }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerResetToMetadataFlow({
                datasetId: params.datasetId,
            })
            .pipe(
                map((data: DatasetTriggerResetToMetadataFlowMutation) => {
                    if (data.datasets.byId?.flows.runs.triggerResetToMetadataFlow.__typename === "TriggerFlowSuccess") {
                        return true;
                    } else {
                        this.toastrService.error(data.datasets.byId?.flows.runs.triggerResetToMetadataFlow.message);
                        return false;
                    }
                }),
            );
    }

    public datasetTriggerResetFlow(params: {
        datasetId: string;
        resetConfigInput: FlowConfigResetInput;
    }): Observable<boolean> {
        return this.datasetFlowApi
            .datasetTriggerResetFlow({
                datasetId: params.datasetId,
                resetConfigInput: params.resetConfigInput,
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

    public cancelFlowRun(params: { datasetId: string; flowId: string }): Observable<boolean> {
        return this.datasetFlowApi.cancelFlowRun(params).pipe(
            map((data: CancelFlowRunMutation) => {
                if (data.datasets.byId?.flows.runs.cancelFlowRun.__typename === "CancelFlowRunSuccess") {
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.flows.runs.cancelFlowRun.message);
                    return false;
                }
            }),
        );
    }

    public datasetFlowsList(params: {
        datasetId: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: DatasetFlowFilters;
    }): Observable<FlowsTableData> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                return {
                    connectionDataForTable: data.datasets.byId?.flows.runs.table as FlowConnectionDataFragment,
                    connectionDataForWidget: data.datasets.byId?.flows.runs.tiles as FlowConnectionWidgetDataFragment,
                    involvedDatasets: [data.datasets.byId] as DatasetBasicsFragment[],
                };
            }),
        );
    }

    public datasetPauseFlows(params: { datasetId: string }): Observable<void> {
        return this.datasetFlowApi.datasetPauseFlows(params).pipe(
            map((data: DatasetPauseFlowsMutation) => {
                const result = data.datasets.byId?.flows.triggers.pauseFlows;
                if (result) {
                    this.toastrService.success("Flows paused");
                } else {
                    this.toastrService.error("Error, flows not paused");
                }
            }),
        );
    }

    public datasetResumeFlows(params: { datasetId: string }): Observable<void> {
        return this.datasetFlowApi.datasetResumeFlows(params).pipe(
            map((data: DatasetResumeFlowsMutation) => {
                const result = data.datasets.byId?.flows.triggers.resumeFlows;
                if (result) {
                    this.toastrService.success("Flows resumed");
                } else {
                    this.toastrService.error("Error, flows not resumed");
                }
            }),
        );
    }

    public datasetFlowById(params: {
        datasetId: string;
        flowId: string;
    }): Observable<MaybeUndefined<DatasetFlowByIdResponse>> {
        return this.datasetFlowApi.getFlowById(params).pipe(
            map((data: GetFlowByIdQuery) => {
                if (data.datasets.byId?.flows.runs.getFlow.__typename === "GetFlowSuccess") {
                    return {
                        flow: data.datasets.byId.flows.runs.getFlow.flow,
                        flowHistory: data.datasets.byId.flows.runs.getFlow.flow.history,
                    };
                } else if (data.datasets.byId?.flows.runs.getFlow.__typename === "FlowNotFound") {
                    this.toastrService.error(data.datasets.byId.flows.runs.getFlow.message);
                }
            }),
        );
    }

    public flowsInitiators(datasetId: string): Observable<AccountFragment[]> {
        return this.datasetFlowApi.getDatasetFlowsInitiators(datasetId).pipe(
            map((data: DatasetFlowsInitiatorsQuery) => {
                return data.datasets.byId?.flows.runs.listFlowInitiators.nodes.sort((a, b) => {
                    if (a.accountName < b.accountName) return -1;
                    if (a.accountName > b.accountName) return 1;
                    return 0;
                }) as AccountFragment[];
            }),
        );
    }
}
