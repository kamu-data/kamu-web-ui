import { MaybeNull } from "./../common/app.types";
import { MutationResult } from "apollo-angular";
import { Injectable } from "@angular/core";
import {
    DatasetFlowBatchingGQL,
    DatasetFlowBatchingMutation,
    DatasetFlowScheduleGQL,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    GetDatasetFlowConfigsGQL,
    GetDatasetFlowConfigsQuery,
    GetDatasetListFlowsGQL,
    GetDatasetListFlowsQuery,
    ScheduleInput,
    TimeDeltaInput,
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
    ) {}

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
        throttlingPeriod: MaybeNull<TimeDeltaInput>;
        minimalDataBatch: MaybeNull<number>;
    }): Observable<DatasetFlowBatchingMutation> {
        return this.datasetFlowBatchingGQL
            .mutate({
                datasetId: params.datasetId,
                datasetFlowType: params.datasetFlowType,
                paused: params.paused,
                throttlingPeriod: params.throttlingPeriod,
                minimalDataBatch: params.minimalDataBatch,
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
    }): Observable<GetDatasetListFlowsQuery> {
        return this.getDatasetListFlowsGQL
            .watch(
                { datasetId: params.datasetId, page: params.page, perPage: params.perPage },
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
}
