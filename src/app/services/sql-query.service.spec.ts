import { TestBed } from "@angular/core/testing";
import { SqlQueryService } from "./sql-query.service";
import { of, first, throwError } from "rxjs";
import { DatasetApi } from "../api/dataset.api";
import {
    mockDatasetDataSqlRunInternalErrorResponse,
    mockDatasetDataSqlRunInvalidSqlResponse,
    mockDatasetDataSqlRunResponse,
} from "../search/mock.data";
import { Apollo } from "apollo-angular";
import { DataQueryResultError } from "../api/kamu.graphql.interface";
import { DataSqlErrorUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { SqlExecutionError } from "../common/errors";

describe("SqlQueryService", () => {
    let service: SqlQueryService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(SqlQueryService);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get SQL query data from api", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunResponse));

        const subscriptionDataChanges$ = service.sqlQueryResponseChanges.pipe(first()).subscribe();

        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");

        service.requestDataSqlRun({ query, limit }).subscribe();

        expect(subscriptionDataChanges$.closed).toBeTrue();
        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledWith({ error: "" });
    });

    it("should check get SQL query data from api with invalid SQL", () => {
        const query = "invalid sql query";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunInvalidSqlResponse));

        const subscriptionDataChanges$ = service.sqlQueryResponseChanges.pipe(first()).subscribe();

        const subscriptionErrorChanges$ = service.sqlErrorOccurrences
            .pipe(first())
            .subscribe((update: DataSqlErrorUpdate) => {
                const errorResult = mockDatasetDataSqlRunInvalidSqlResponse.data.query as DataQueryResultError;
                expect(update.error).toEqual(errorResult.errorMessage);
            });

        service.requestDataSqlRun({ query, limit }).subscribe();

        expect(subscriptionDataChanges$.closed).toBeFalse();
        expect(subscriptionErrorChanges$.closed).toBeTrue();
    });

    it("should check get SQL query data from api when SQL execution fails softly", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunInternalErrorResponse));

        service.sqlQueryResponseChanges.subscribe(() => fail("Unexpected data update"));
        service.sqlErrorOccurrences.subscribe(() => fail("Unexpected SQL error update"));

        const subscription$ = service
            .requestDataSqlRun({ query, limit })
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    const errorResult = mockDatasetDataSqlRunInternalErrorResponse.data.query as DataQueryResultError;
                    expect(e).toEqual(new SqlExecutionError(errorResult.errorMessage));
                },
            });
        expect(subscription$.closed).toBeTrue();
    });

    it("should check get SQL query data from api when SQL execution fails hardly", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(throwError(() => new SqlExecutionError()));

        service.sqlQueryResponseChanges.subscribe(() => fail("Unexpected data update"));
        service.sqlErrorOccurrences.subscribe(() => fail("Unexpected SQL error update"));

        const subscription$ = service
            .requestDataSqlRun({ query, limit })
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => expect(e).toEqual(new SqlExecutionError()),
            });
        expect(subscription$.closed).toBeTrue();
    });
});
