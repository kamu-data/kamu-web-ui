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
    DatasetTriggerFlowGQL,
    DatasetTriggerFlowMutation,
    FlowConfigurationInput,
    FlowRunConfiguration,
    FlowTriggerInput,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersGQL,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    GetFlowByIdGQL,
    GetFlowByIdQuery,
    SetDatasetFlowConfigGQL,
    SetDatasetFlowConfigMutation,
    SetDatasetFlowTriggersGQL,
    SetDatasetFlowTriggersMutation,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/values/errors";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";

@Injectable({ providedIn: "root" })
export class DatasetFlowApi {
    private getDatasetFlowConfigsGQL = inject(GetDatasetFlowConfigsGQL);
    private getDatasetListFlowsGQL = inject(GetDatasetListFlowsGQL);
    private datasetPauseFlowsGQL = inject(DatasetPauseFlowsGQL);
    private datasetResumeFlowsGQL = inject(DatasetResumeFlowsGQL);
    private datasetAllFlowsPausedGQL = inject(DatasetAllFlowsPausedGQL);
    private datasetTriggerFlowGQL = inject(DatasetTriggerFlowGQL);
    private datasetFlowByIdGQL = inject(GetFlowByIdGQL);
    private cancelScheduledTasksGQL = inject(CancelScheduledTasksGQL);
    private datasetFlowsInitiatorsGQL = inject(DatasetFlowsInitiatorsGQL);
    private setDatasetFlowConfigGQL = inject(SetDatasetFlowConfigGQL);
    private setDatasetFlowTriggersGQL = inject(SetDatasetFlowTriggersGQL);
    private getDatasetFlowTriggersGQL = inject(GetDatasetFlowTriggersGQL);

    public datasetTriggerFlow(params: {
        accountId: string;
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        flowRunConfiguration?: FlowRunConfiguration;
    }): Observable<DatasetTriggerFlowMutation> {
        return this.datasetTriggerFlowGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<DatasetTriggerFlowMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
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

    public setDatasetFlowConfigs(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        configInput: FlowConfigurationInput;
    }): Observable<SetDatasetFlowConfigMutation> {
        return this.setDatasetFlowConfigGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                configInput: params.configInput,
            })
            .pipe(
                first(),
                map((result: MutationResult<SetDatasetFlowConfigMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
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
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
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
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
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
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
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
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
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
