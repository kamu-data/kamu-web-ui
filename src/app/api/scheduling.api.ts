import { Injectable } from "@angular/core";
import {
    GetDatasetBatchingGQL,
    GetDatasetBatchingQuery,
    GetDatasetIngestScheduleGQL,
    GetDatasetIngestScheduleQuery,
} from "./kamu.graphql.interface";
import { Observable, first, map } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";

@Injectable({ providedIn: "root" })
export class SchedulingApi {
    constructor(
        private getDatasetIngestScheduleGQL: GetDatasetIngestScheduleGQL,
        private getDatasetBatchingGQL: GetDatasetBatchingGQL,
    ) {}

    public getDatasetIngestSchedule(datasetId: string): Observable<GetDatasetIngestScheduleQuery> {
        return this.getDatasetIngestScheduleGQL
            .watch({
                datasetId,
            })
            .valueChanges.pipe(
                first(),
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
}
