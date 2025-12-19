/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MutationResult } from "apollo-angular";
import { inject, Injectable } from "@angular/core";
import {
    CancelFlowRunGQL,
    CancelFlowRunMutation,
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetFlowsInitiatorsGQL,
    DatasetFlowsInitiatorsQuery,
    DatasetFlowsProcessesGQL,
    DatasetFlowsProcessesQuery,
    DatasetPauseFlowsGQL,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsGQL,
    DatasetResumeFlowsMutation,
    DatasetTriggerCompactionFlowGQL,
    DatasetTriggerCompactionFlowMutation,
    DatasetTriggerIngestFlowGQL,
    DatasetTriggerIngestFlowMutation,
    DatasetTriggerResetFlowGQL,
    DatasetTriggerResetFlowMutation,
    DatasetTriggerResetToMetadataFlowGQL,
    DatasetTriggerResetToMetadataFlowMutation,
    DatasetTriggerTransformFlowGQL,
    DatasetTriggerTransformFlowMutation,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    FlowConfigResetInput,
    FlowRetryPolicyInput,
    FlowTriggerRuleInput,
    FlowTriggerStopPolicyInput,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggerGQL,
    GetDatasetFlowTriggerQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    GetFlowByIdGQL,
    GetFlowByIdQuery,
    PauseDatasetFlowTriggerGQL,
    PauseDatasetFlowTriggerMutation,
    SetCompactionFlowConfigGQL,
    SetCompactionFlowConfigMutation,
    SetDatasetFlowTriggerGQL,
    SetDatasetFlowTriggerMutation,
    SetIngestFlowConfigGQL,
    SetIngestFlowConfigMutation,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { MaybeNull } from "../interface/app.types";

@Injectable({ providedIn: "root" })
export class DatasetFlowApi {
    private getDatasetFlowConfigsGQL = inject(GetDatasetFlowConfigsGQL);
    private getDatasetListFlowsGQL = inject(GetDatasetListFlowsGQL);
    private datasetPauseFlowsGQL = inject(DatasetPauseFlowsGQL);
    private datasetResumeFlowsGQL = inject(DatasetResumeFlowsGQL);

    private datasetTriggerIngestFlowGQL = inject(DatasetTriggerIngestFlowGQL);
    private datasetTriggetTransformFlowGQL = inject(DatasetTriggerTransformFlowGQL);
    private datasetTriggerCompactionFlowGQL = inject(DatasetTriggerCompactionFlowGQL);
    private datasetTriggerResetFlowGQL = inject(DatasetTriggerResetFlowGQL);
    private datasetTriggerResetToMetadataFlowGQL = inject(DatasetTriggerResetToMetadataFlowGQL);

    private datasetFlowByIdGQL = inject(GetFlowByIdGQL);
    private cancelFlowRunGQL = inject(CancelFlowRunGQL);
    private datasetFlowsInitiatorsGQL = inject(DatasetFlowsInitiatorsGQL);
    private setDatasetFlowTriggerGQL = inject(SetDatasetFlowTriggerGQL);
    private pauseDatasetFlowTriggerGQL = inject(PauseDatasetFlowTriggerGQL);
    private getDatasetFlowTriggerGQL = inject(GetDatasetFlowTriggerGQL);

    private setIngestFlowConfigGQL = inject(SetIngestFlowConfigGQL);
    private setCompactionFlowConfigGQL = inject(SetCompactionFlowConfigGQL);

    private datasetFlowsProcessesGQL = inject(DatasetFlowsProcessesGQL);

    public getDatasetFlowsProcesses(params: { datasetId: string }): Observable<DatasetFlowsProcessesQuery> {
        return this.datasetFlowsProcessesGQL
            .watch(params, {
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetFlowsProcessesQuery>) => {
                    return result.data;
                }),
            );
    }

    public datasetTriggerIngestFlow(params: {
        datasetId: string;
        ingestConfigInput?: FlowConfigIngestInput;
    }): Observable<DatasetTriggerIngestFlowMutation> {
        return this.datasetTriggerIngestFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerIngestFlowMutation>) => {
                return result.data as DatasetTriggerIngestFlowMutation;
            }),
        );
    }

    public datasetTriggerTransformFlow(params: { datasetId: string }): Observable<DatasetTriggerTransformFlowMutation> {
        return this.datasetTriggetTransformFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerTransformFlowMutation>) => {
                return result.data as DatasetTriggerTransformFlowMutation;
            }),
        );
    }

    public datasetTriggerCompactionFlow(params: {
        datasetId: string;
        compactionConfigInput?: FlowConfigCompactionInput;
    }): Observable<DatasetTriggerCompactionFlowMutation> {
        return this.datasetTriggerCompactionFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerCompactionFlowMutation>) => {
                return result.data as DatasetTriggerCompactionFlowMutation;
            }),
        );
    }

    public datasetTriggerResetFlow(params: {
        datasetId: string;
        resetConfigInput: FlowConfigResetInput;
    }): Observable<DatasetTriggerResetFlowMutation> {
        return this.datasetTriggerResetFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerResetFlowMutation>) => {
                return result.data as DatasetTriggerResetFlowMutation;
            }),
        );
    }

    public datasetTriggerResetToMetadataFlow(params: {
        datasetId: string;
    }): Observable<DatasetTriggerResetToMetadataFlowMutation> {
        return this.datasetTriggerResetToMetadataFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerResetToMetadataFlowMutation>) => {
                return result.data as DatasetTriggerResetToMetadataFlowMutation;
            }),
        );
    }

    public getDatasetFlowConfigs(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
    }): Observable<GetDatasetFlowConfigsQuery> {
        return this.getDatasetFlowConfigsGQL
            .watch({ datasetId: params.datasetId, datasetFlowType: params.datasetFlowType }, noCacheFetchPolicy)
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetFlowConfigsQuery>) => {
                    return result.data;
                }),
            );
    }

    public setDatasetFlowIngestConfig(params: {
        datasetId: string;
        ingestConfigInput: FlowConfigIngestInput;
        retryPolicyInput: MaybeNull<FlowRetryPolicyInput>;
    }): Observable<SetIngestFlowConfigMutation> {
        return this.setIngestFlowConfigGQL
            .mutate({
                datasetId: params.datasetId,
                ingestConfigInput: params.ingestConfigInput,
                retryPolicyInput: params.retryPolicyInput,
            })
            .pipe(
                first(),
                map((result: MutationResult<SetIngestFlowConfigMutation>) => {
                    return result.data as SetIngestFlowConfigMutation;
                }),
            );
    }

    public setDatasetFlowCompactionConfig(params: {
        datasetId: string;
        compactionConfigInput: FlowConfigCompactionInput;
    }): Observable<SetCompactionFlowConfigMutation> {
        return this.setCompactionFlowConfigGQL
            .mutate({
                datasetId: params.datasetId,
                compactionConfigInput: params.compactionConfigInput,
            })
            .pipe(
                first(),
                map((result: MutationResult<SetCompactionFlowConfigMutation>) => {
                    return result.data as SetCompactionFlowConfigMutation;
                }),
            );
    }

    public setDatasetFlowTrigger(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        triggerRuleInput: FlowTriggerRuleInput;
        triggerStopPolicyInput: FlowTriggerStopPolicyInput;
    }): Observable<SetDatasetFlowTriggerMutation> {
        return this.setDatasetFlowTriggerGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<SetDatasetFlowTriggerMutation>) => {
                return result.data as SetDatasetFlowTriggerMutation;
            }),
        );
    }

    public pauseDatasetFlowTrigger(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
    }): Observable<PauseDatasetFlowTriggerMutation> {
        return this.pauseDatasetFlowTriggerGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<PauseDatasetFlowTriggerMutation>) => {
                return result.data as PauseDatasetFlowTriggerMutation;
            }),
        );
    }

    public getDatasetFlowTrigger(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
    }): Observable<GetDatasetFlowTriggerQuery> {
        return this.getDatasetFlowTriggerGQL
            .watch(params, {
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetFlowTriggerQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetListFlows(params: {
        datasetId: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: DatasetFlowFilters;
    }): Observable<GetDatasetListFlowsQuery> {
        return this.getDatasetListFlowsGQL
            .watch(
                {
                    datasetId: params.datasetId,
                    page: params.page,
                    perPageTable: params.perPageTable,
                    perPageTiles: params.perPageTiles,
                    filters: params.filters,
                },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetListFlowsQuery>) => {
                    return result.data;
                }),
            );
    }

    public datasetPauseFlows(params: { datasetId: string }): Observable<DatasetPauseFlowsMutation> {
        return this.datasetPauseFlowsGQL
            .mutate({
                datasetId: params.datasetId,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetPauseFlowsMutation>) => {
                    return result.data as DatasetPauseFlowsMutation;
                }),
            );
    }

    public datasetResumeFlows(params: { datasetId: string }): Observable<DatasetResumeFlowsMutation> {
        return this.datasetResumeFlowsGQL
            .mutate({
                datasetId: params.datasetId,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetResumeFlowsMutation>) => {
                    return result.data as DatasetResumeFlowsMutation;
                }),
            );
    }

    public getFlowById(params: { datasetId: string; flowId: string }): Observable<GetFlowByIdQuery> {
        return this.datasetFlowByIdGQL
            .watch({ datasetId: params.datasetId, flowId: params.flowId }, noCacheFetchPolicy)
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetFlowByIdQuery>) => {
                    return result.data;
                }),
            );
    }

    public cancelFlowRun(params: { datasetId: string; flowId: string }): Observable<CancelFlowRunMutation> {
        return this.cancelFlowRunGQL
            .mutate({
                datasetId: params.datasetId,
                flowId: params.flowId,
            })
            .pipe(
                first(),
                map((result: MutationResult<CancelFlowRunMutation>) => {
                    return result.data as CancelFlowRunMutation;
                }),
            );
    }

    public getDatasetFlowsInitiators(datasetId: string): Observable<DatasetFlowsInitiatorsQuery> {
        return this.datasetFlowsInitiatorsGQL
            .watch(
                { datasetId },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetFlowsInitiatorsQuery>) => {
                    return result.data;
                }),
            );
    }
}
