/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable, ReplaySubject, Subject, catchError, map } from "rxjs";
import { MaybeNull } from "../interface/app.types";
import { DataSqlErrorUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql, DataRow, DataSchemaField } from "../interface/dataset.interface";
import { parseDataFromJsonAoSFormat } from "../common/helpers/data.helpers";
import { SqlQueryRestResponseState } from "../query/global-query/global-query.model";
import { HttpErrorResponse, HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfigService } from "../app-config.service";
import {
    SqlQueryRestResponse,
    QueryExplainerCommitmentType,
    QueryExplainerInputType,
} from "../query-explainer/query-explainer.types";
import { extractSchemaFieldsFromData } from "../common/helpers/table.helper";
import AppValues from "../common/values/app.values";
import { LoggedUserService } from "../auth/logged-user.service";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: "root",
})
export class SqlQueryService {
    private appConfigService = inject(AppConfigService);
    private http = inject(HttpClient);
    private loggedUserService = inject(LoggedUserService);
    private localStorageService = inject(LocalStorageService);

    private sqlQueryResponse$: Subject<MaybeNull<SqlQueryRestResponseState>> = new ReplaySubject<
        MaybeNull<SqlQueryRestResponseState>
    >(1 /*bufferSize*/);
    private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);

    public emitSqlQueryResponseChanged(dataUpdate: MaybeNull<SqlQueryRestResponseState>): void {
        this.sqlQueryResponse$.next(dataUpdate);
    }

    public get sqlQueryResponseChanges(): Observable<MaybeNull<SqlQueryRestResponseState>> {
        return this.sqlQueryResponse$.asObservable();
    }

    public emitSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
        this.sqlError$.next(dataSqlErrorUpdate);
    }

    public resetSqlError(): void {
        this.emitSqlErrorOccurred({ error: "" });
    }

    public get baseUrl(): string {
        return this.appConfigService.apiServerHttpUrl;
    }

    public get sqlErrorOccurrences(): Observable<DataSqlErrorUpdate> {
        return this.sqlError$.asObservable();
    }

    // Uncomment for GraphQL
    // public requestGraphQLDataSqlRun(params: DatasetRequestBySql): Observable<void> {
    //     return this.datasetApi.getDatasetDataSqlRun(params).pipe(
    //         map((result: GetDatasetDataSqlRunQuery) => {
    //             const queryResult = result.data.query;
    //             if (queryResult.__typename === "DataQueryResultSuccess") {
    //                 const involvedDatasetsId = queryResult.datasets?.map((item) => item.id) ?? [];
    //                 const content: DataRow[] = parseDataRows(queryResult);
    //                 const schema: MaybeNull<DatasetSchema> = queryResult.schema
    //                     ? parseSchema(queryResult.schema.content)
    //                     : null;

    //                 const sqlQueryResponse: SqlQueryResponseState = {
    //                     content,
    //                     schema,
    //                     involvedDatasetsId,
    //                 };
    //                 this.emitSqlQueryResponseChanged(sqlQueryResponse);
    //                 this.resetSqlError();
    //             } else if (queryResult.errorKind === DataQueryResultErrorKind.InvalidSql) {
    //                 this.emitSqlErrorOccurred({
    //                     error: queryResult.errorMessage,
    //                 });
    //             } else {
    //                 throw new SqlExecutionError(queryResult.errorMessage);
    //             }
    //         }),
    //     );
    // }

    public requestDataSqlRun(params: DatasetRequestBySql): Observable<void> {
        const url = new URL(`${this.baseUrl}/query`);
        const body: QueryExplainerInputType = {
            query: params.query,
            include: params.enabledProof ? ["Input", "Schema", "Proof"] : ["Input", "Schema"],
            limit: params.limit ? params.limit : AppValues.SQL_QUERY_LIMIT,
            skip: params.skip,
        };
        let headers = new HttpHeaders();
        if (this.loggedUserService.isAuthenticated) {
            headers = headers
                .set("Authorization", `Bearer ${this.localStorageService.accessToken}`)
                .set(AppValues.HEADERS_SKIP_LOADING_KEY, `true`);
        }

        return this.http.post<SqlQueryRestResponse>(url.href, body, { headers }).pipe(
            map((result: SqlQueryRestResponse) => {
                const involvedDatasetsId = result.input.datasets?.map((item) => item.id) as string[];
                const columnNames: string[] = result.output?.schema.fields.map((item) => item.name) as string[];
                const content: DataRow[] = parseDataFromJsonAoSFormat(result.output?.data as object[], columnNames);
                const schema: DataSchemaField[] = extractSchemaFieldsFromData(content[0] ?? []);
                const sqlQueryResponse: SqlQueryRestResponseState = !result.proof
                    ? {
                          content,
                          schema,
                          involvedDatasetsId,
                      }
                    : {
                          content,
                          schema,
                          involvedDatasetsId,
                          proofResponse: {
                              input: result.input,
                              commitment: result.commitment as QueryExplainerCommitmentType,
                              proof: result.proof,
                              subQueries: [],
                          },
                      };

                this.emitSqlQueryResponseChanged(sqlQueryResponse);
                this.resetSqlError();
            }),
            catchError((e: HttpErrorResponse) => {
                this.emitSqlErrorOccurred({
                    error: (e.error as { message: string }).message,
                });
                return EMPTY;
            }),
        );
    }
}
