import { MutationResult } from "apollo-angular";
import { Injectable } from "@angular/core";
import {
    BatchingConditionInput,
    DatasetAllFlowsPausedGQL,
    DatasetAllFlowsPausedQuery,
    DatasetFlowBatchingGQL,
    DatasetFlowBatchingMutation,
    DatasetFlowFilters,
    DatasetFlowScheduleGQL,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    DatasetPauseFlowsGQL,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsGQL,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowGQL,
    DatasetTriggerFlowMutation,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    ScheduleInput,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/errors";

@Injectable({ providedIn: "root" })
export class DatasetFlowApi {
    constructor(
        private getDatasetFlowConfigsGQL: GetDatasetFlowConfigsGQL,
        private datasetFlowScheduleGQL: DatasetFlowScheduleGQL,
        private datasetFlowBatchingGQL: DatasetFlowBatchingGQL,
        private getDatasetListFlowsGQL: GetDatasetListFlowsGQL,
        private datasetPauseFlowsGQL: DatasetPauseFlowsGQL,
        private datasetResumeFlowsGQL: DatasetResumeFlowsGQL,
        private datasetAllFlowsPausedGQL: DatasetAllFlowsPausedGQL,
        private datasetTriggerFlowGQL: DatasetTriggerFlowGQL,
    ) {}

    public datasetTriggerFlow(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
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
            .watch(
                { datasetId: params.datasetId, datasetFlowType: params.datasetFlowType },
                {
                    fetchPolicy: "no-cache",
                    errorPolicy: "all",
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetFlowConfigsQuery>) => {
                    return result.data;
                }),
            );
    }

    public setDatasetFlowSchedule(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        schedule: ScheduleInput;
    }): Observable<DatasetFlowScheduleMutation> {
        return this.datasetFlowScheduleGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                paused: params.paused,
                schedule: params.schedule,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetFlowScheduleMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public setDatasetFlowBatching(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        batching: BatchingConditionInput;
    }): Observable<DatasetFlowBatchingMutation> {
        return this.datasetFlowBatchingGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                paused: params.paused,
                batching: params.batching,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetFlowBatchingMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public getDatasetListFlows(params: {
        datasetId: string;
        page: number;
        perPage: number;
        filters: DatasetFlowFilters;
    }): Observable<GetDatasetListFlowsQuery> {
        return this.getDatasetListFlowsGQL
            .watch(
                { datasetId: params.datasetId, page: params.page, perPage: params.perPage, filters: params.filters },
                {
                    fetchPolicy: "no-cache",
                    errorPolicy: "all",
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
        return this.datasetAllFlowsPausedGQL
            .watch(
                { datasetId },
                {
                    fetchPolicy: "no-cache",
                    errorPolicy: "all",
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetAllFlowsPausedQuery>) => {
                    return result.data;
                }),
            );
    }
}
