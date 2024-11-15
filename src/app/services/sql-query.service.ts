import { DatasetSubscriptionsService } from "./../dataset-view/dataset.subscriptions.service";
import { inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject, map } from "rxjs";
import { GetDatasetDataSqlRunQuery, DataQueryResultErrorKind } from "../api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { SqlExecutionError } from "../common/errors";
import { DataSqlErrorUpdate, DataUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql, DataRow, DatasetSchema } from "../interface/dataset.interface";
import { DatasetApi } from "../api/dataset.api";
import { parseDataRows, parseSchema } from "../common/data.helpers";

@Injectable({
    providedIn: "root",
})
export class SqlQueryService {
    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);

    private sqlQueryData$: Subject<MaybeNull<DataUpdate>> = new ReplaySubject<MaybeNull<DataUpdate>>(1 /*bufferSize*/);
    private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);
    private involvedSqlDatasetsId$: Subject<string[]> = new ReplaySubject<string[]>(1 /*bufferSize*/);

    public emitSqlQueryDataChanged(dataUpdate: MaybeNull<DataUpdate>): void {
        this.sqlQueryData$.next(dataUpdate);
    }

    public get sqlQueryDataChanges(): Observable<MaybeNull<DataUpdate>> {
        return this.sqlQueryData$.asObservable();
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

    public emitInvolvedSqlDatasetsId(ids: string[]): void {
        this.involvedSqlDatasetsId$.next(ids);
    }

    public get involvedSqlDatasetsIdChanges(): Observable<string[]> {
        return this.involvedSqlDatasetsId$.asObservable();
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

                    const dataUpdate: DataUpdate = {
                        content,
                        schema,
                    };
                    this.emitSqlQueryDataChanged(dataUpdate);
                    this.emitInvolvedSqlDatasetsId(involvedDatasetsId);
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
