import { MutationResult } from "apollo-angular";
import { Injectable } from "@angular/core";
import {
    CancelScheduledTasksGQL,
    CancelScheduledTasksMutation,
    CompactionConditionInput,
    DatasetAllFlowsPausedGQL,
    DatasetAllFlowsPausedQuery,
    DatasetFlowBatchingGQL,
    DatasetFlowBatchingMutation,
    DatasetFlowCompactionGQL,
    DatasetFlowCompactionMutation,
    DatasetFlowFilters,
    DatasetFlowScheduleGQL,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    DatasetFlowsInitiatorsGQL,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsGQL,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsGQL,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowGQL,
    DatasetTriggerFlowMutation,
    FlowRunConfiguration,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    GetFlowByIdGQL,
    GetFlowByIdQuery,
    IngestConditionInput,
    TransformConditionInput,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/errors";
import { noCacheFetchPolicy } from "../common/data.helpers";

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
        private datasetFlowByIdGQL: GetFlowByIdGQL,
        private cancelScheduledTasksGQL: CancelScheduledTasksGQL,
        private datasetFlowCompactionGQL: DatasetFlowCompactionGQL,
        private datasetFlowsInitiatorsGQL: DatasetFlowsInitiatorsGQL,
    ) {}

    public datasetTriggerFlow(params: {
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

    public setDatasetFlowSchedule(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        paused: boolean;
        ingest: IngestConditionInput;
    }): Observable<DatasetFlowScheduleMutation> {
        return this.datasetFlowScheduleGQL
            .mutate({
                ...params,
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
        transform: TransformConditionInput;
    }): Observable<DatasetFlowBatchingMutation> {
        return this.datasetFlowBatchingGQL
            .mutate({
                ...params,
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

    public setDatasetFlowCompaction(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        compactionArgs: CompactionConditionInput;
    }): Observable<DatasetFlowCompactionMutation> {
        return this.datasetFlowCompactionGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                compactionArgs: params.compactionArgs,
            })
            .pipe(
                first(),
                map((result: MutationResult<DatasetFlowCompactionMutation>) => {
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
