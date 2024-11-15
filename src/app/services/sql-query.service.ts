import { DatasetSubscriptionsService } from "./../dataset-view/dataset.subscriptions.service";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { GetDatasetDataSqlRunQuery, DataQueryResultErrorKind } from "../api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { SqlExecutionError } from "../common/errors";
import { DataUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql, DataRow, DatasetSchema } from "../interface/dataset.interface";
import { DatasetApi } from "../api/dataset.api";
import { parseDataRows, parseSchema } from "../common/data.helpers";

@Injectable({
    providedIn: "root",
})
export class SqlQueryService {
    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);

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
                    this.datasetSubsService.emitSqlQueryDataChanged(dataUpdate);
                    this.datasetSubsService.emitInvolvedSqlDatasetsId(involvedDatasetsId);
                    this.datasetSubsService.resetSqlError();
                } else if (queryResult.errorKind === DataQueryResultErrorKind.InvalidSql) {
                    this.datasetSubsService.emitSqlErrorOccurred({
                        error: queryResult.errorMessage,
                    });
                } else {
                    throw new SqlExecutionError(queryResult.errorMessage);
                }
            }),
        );
    }
}
