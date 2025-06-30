/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MutationResult } from "apollo-angular";
import { inject, Injectable } from "@angular/core";
import {
    CancelScheduledTasksGQL,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedGQL,
    DatasetAllFlowsPausedQuery,
    DatasetFlowFilters,
    DatasetFlowType,
    DatasetFlowsInitiatorsGQL,
    DatasetFlowsInitiatorsQuery,
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
    DatasetTriggerTransformFlowGQL,
    DatasetTriggerTransformFlowMutation,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    FlowConfigResetInput,
    FlowRetryPolicyInput,
    FlowTriggerInput,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersGQL,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    GetFlowByIdGQL,
    GetFlowByIdQuery,
    SetCompactionFlowConfigGQL,
    SetCompactionFlowConfigMutation,
    SetDatasetFlowTriggersGQL,
    SetDatasetFlowTriggersMutation,
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
    private datasetAllFlowsPausedGQL = inject(DatasetAllFlowsPausedGQL);

    private datasetTriggerIngestFlowGQL = inject(DatasetTriggerIngestFlowGQL);
    private datasetTriggetTransformFlowGQL = inject(DatasetTriggerTransformFlowGQL);
    private datasetTriggerCompactionFlowGQL = inject(DatasetTriggerCompactionFlowGQL);
    private datasetTriggerResetFlowGQL = inject(DatasetTriggerResetFlowGQL);

    private datasetFlowByIdGQL = inject(GetFlowByIdGQL);
    private cancelScheduledTasksGQL = inject(CancelScheduledTasksGQL);
    private datasetFlowsInitiatorsGQL = inject(DatasetFlowsInitiatorsGQL);
    private setDatasetFlowTriggersGQL = inject(SetDatasetFlowTriggersGQL);
    private getDatasetFlowTriggersGQL = inject(GetDatasetFlowTriggersGQL);

    private setIngestFlowConfigGQL = inject(SetIngestFlowConfigGQL);
    private setCompactionFlowConfigGQL = inject(SetCompactionFlowConfigGQL);

    public datasetTriggerIngestFlow(params: {
        accountId: string;
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

    public datasetTriggerTransformFlow(params: {
        accountId: string;
        datasetId: string;
    }): Observable<DatasetTriggerTransformFlowMutation> {
        return this.datasetTriggetTransformFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerTransformFlowMutation>) => {
                return result.data as DatasetTriggerTransformFlowMutation;
            }),
        );
    }

    public datasetTriggerCompactionFlow(params: {
        accountId: string;
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
        accountId: string;
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

    public setDatasetFlowTriggers(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        triggerInput: FlowTriggerInput;
    }): Observable<SetDatasetFlowTriggersMutation> {
        return this.setDatasetFlowTriggersGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<SetDatasetFlowTriggersMutation>) => {
                return result.data as SetDatasetFlowTriggersMutation;
            }),
        );
    }

    public getDatasetFlowTriggers(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
    }): Observable<GetDatasetFlowTriggersQuery> {
        return this.getDatasetFlowTriggersGQL
            .watch(params, {
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetFlowTriggersQuery>) => {
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

    public datasetPauseFlows(params: {
        datasetId: string;
        datasetFlowType?: DatasetFlowType;
    }): Observable<DatasetPauseFlowsMutation> {
        return this.datasetPauseFlowsGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetPauseFlowsMutation>) => {
                    return result.data as DatasetPauseFlowsMutation;
                }),
            );
    }

    public datasetResumeFlows(params: {
        datasetId: string;
        datasetFlowType?: DatasetFlowType;
    }): Observable<DatasetResumeFlowsMutation> {
        return this.datasetResumeFlowsGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetResumeFlowsMutation>) => {
                    return result.data as DatasetResumeFlowsMutation;
                }),
            );
    }

    public allFlowsPaused(datasetId: string): Observable<DatasetAllFlowsPausedQuery> {
        return this.datasetAllFlowsPausedGQL.watch({ datasetId }, noCacheFetchPolicy).valueChanges.pipe(
            map((result: ApolloQueryResult<DatasetAllFlowsPausedQuery>) => {
                return result.data;
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

    public cancelScheduledTasks(params: {
        datasetId: string;
        flowId: string;
    }): Observable<CancelScheduledTasksMutation> {
        return this.cancelScheduledTasksGQL
            .mutate({
                datasetId: params.datasetId,
                flowId: params.flowId,
            })
            .pipe(
                first(),
                map((result: MutationResult<CancelScheduledTasksMutation>) => {
                    return result.data as CancelScheduledTasksMutation;
                }),
            );
    }

    public getDatasetFlowsInitiators(datasetId: string): Observable<DatasetFlowsInitiatorsQuery> {
        return this.datasetFlowsInitiatorsGQL.watch({ datasetId }, noCacheFetchPolicy).valueChanges.pipe(
            map((result: ApolloQueryResult<DatasetFlowsInitiatorsQuery>) => {
                return result.data;
            }),
        );
    }
}
