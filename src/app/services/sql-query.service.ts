/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject, map } from "rxjs";
import { GetDatasetDataSqlRunQuery, DataQueryResultErrorKind } from "../api/kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { SqlExecutionError } from "../common/values/errors";
import { DataSqlErrorUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql, DataRow, DatasetSchema } from "../interface/dataset.interface";
import { DatasetApi } from "../api/dataset.api";
import { parseDataRows, parseSchema } from "../common/helpers/data.helpers";
import { SqlQueryResponseState } from "../query/global-query/global-query.model";

@Injectable({
    providedIn: "root",
})
export class SqlQueryService {
    private datasetApi = inject(DatasetApi);

    private sqlQueryResponse$: Subject<MaybeNull<SqlQueryResponseState>> = new ReplaySubject<
        MaybeNull<SqlQueryResponseState>
    >(1 /*bufferSize*/);
    private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);

    public emitSqlQueryResponseChanged(dataUpdate: MaybeNull<SqlQueryResponseState>): void {
        this.sqlQueryResponse$.next(dataUpdate);
    }

    public get sqlQueryResponseChanges(): Observable<MaybeNull<SqlQueryResponseState>> {
        return this.sqlQueryResponse$.asObservable();
    }

    public emitSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
        this.sqlError$.next(dataSqlErrorUpdate);
    }

    public resetSqlError(): void {
        this.emitSqlErrorOccurred({ error: "" });
    }

    public get sqlErrorOccurrences(): Observable<DataSqlErrorUpdate> {
        return this.sqlError$.asObservable();
    }

    public requestDataSqlRun(params: DatasetRequestBySql): Observable<void> {
        return this.datasetApi.getDatasetDataSqlRun(params).pipe(
            map((result: GetDatasetDataSqlRunQuery) => {
                const queryResult = result.data.query;
                if (queryResult.__typename === "DataQueryResultSuccess") {
                    const involvedDatasetsId = queryResult.datasets?.map((item) => item.id) ?? [];
                    const content: DataRow[] = parseDataRows(queryResult);
                    const schema: MaybeNull<DatasetSchema> = queryResult.schema
                        ? parseSchema(queryResult.schema.content)
                        : null;

                    const sqlQueryResponse: SqlQueryResponseState = {
                        content,
                        schema,
                        involvedDatasetsId,
                    };
                    this.emitSqlQueryResponseChanged(sqlQueryResponse);
                    this.resetSqlError();
                } else if (queryResult.errorKind === DataQueryResultErrorKind.InvalidSql) {
                    this.emitSqlErrorOccurred({
                        error: queryResult.errorMessage,
                    });
                } else {
                    throw new SqlExecutionError(queryResult.errorMessage);
                }
            }),
        );
    }
}
