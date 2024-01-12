import { MutationResult } from "apollo-angular";
import { Injectable } from "@angular/core";
import {
    GetDatasetBatchingGQL,
    GetDatasetBatchingQuery,
    GetDatasetIngestScheduleGQL,
    GetDatasetIngestScheduleQuery,
    ScheduleInput,
    SetConfigBatchingGQL,
    SetConfigBatchingMutation,
    SetConfigScheduleGQL,
    SetConfigScheduleMutation,
    TimeDeltaInput,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/errors";

@Injectable({ providedIn: "root" })
export class SchedulingApi {
    constructor(
        private getDatasetIngestScheduleGQL: GetDatasetIngestScheduleGQL,
        private getDatasetBatchingGQL: GetDatasetBatchingGQL,
        private setConfigScheduleGQL: SetConfigScheduleGQL,
        private setConfigBatchingGQL: SetConfigBatchingGQL,
    ) {}

    public getDatasetIngestSchedule(datasetId: string): Observable<GetDatasetIngestScheduleQuery> {
        return this.getDatasetIngestScheduleGQL
            .watch({
                datasetId,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetIngestScheduleQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetBatching(datasetId: string): Observable<GetDatasetBatchingQuery> {
        return this.getDatasetBatchingGQL
            .watch({
                datasetId,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetBatchingQuery>) => {
                    return result.data;
                }),
            );
    }

    public setConfigSchedule(params: {
        datasetId: string;
        paused: boolean;
        schedule: ScheduleInput;
    }): Observable<SetConfigScheduleMutation> {
        return this.setConfigScheduleGQL
            .mutate({
                datasetId: params.datasetId,
                paused: params.paused,
                schedule: params.schedule,
            })
            .pipe(
                first(),
                map((result: MutationResult<SetConfigScheduleMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public setConfigBatching(params: {
        datasetId: string;
        paused: boolean;
        throttlingPeriod: TimeDeltaInput;
        minimalDataBatch: number;
    }): Observable<SetConfigBatchingMutation> {
        return this.setConfigBatchingGQL
            .mutate({
                datasetId: params.datasetId,
                paused: params.paused,
                throttlingPeriod: params.throttlingPeriod,
                minimalDataBatch: params.minimalDataBatch,
            })
            .pipe(
                first(),
                map((result: MutationResult<SetConfigBatchingMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }
}
