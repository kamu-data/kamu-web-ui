import {
    mockDatasetDataSqlRunResponse,
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
    mockDatasetResponseNotFound,
    mockDatasetInfo,
    mockDatasetDataSqlRunInvalidSqlResponse,
    mockDatasetDataSqlRunInternalErrorResponse,
    mockFullPowerDatasetPermissionsFragment,
} from "../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetApi } from "../api/dataset.api";
import { ModalService } from "../components/modal/modal.service";
import { DatasetService } from "./dataset.service";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    DataQueryResultError,
    DataQueryResultErrorKind,
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { of, throwError } from "rxjs";
import { DatasetNotFoundError, SqlExecutionError } from "../common/errors";
import { DatasetHistoryUpdate, DataSqlErrorUpdate, OverviewDataUpdate } from "./dataset.subscriptions.interface";
import { first } from "rxjs/operators";
import _ from "lodash";
import { mockDatasetBasicsWithPermissionQuery } from "../api/mock/dataset.mock";

describe("AppDatasetService", () => {
    let service: DatasetService;
    let datasetApi: DatasetApi;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloModule, ApolloTestingModule, HttpClientTestingModule],
            providers: [DatasetApi, ModalService, DatasetService, DatasetSubscriptionsService, Apollo],
        });
        service = TestBed.inject(DatasetService);
        datasetApi = TestBed.inject(DatasetApi);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get main data from api", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(mockDatasetMainDataResponse));

        const datasetChangesSubscription$ = service.onDatasetChanges
            .pipe(first())
            .subscribe((dataset: DatasetBasicsFragment) => {
                const expectedDatasetBasics = mockDatasetMainDataResponse.datasets
                    .byOwnerAndName as DatasetBasicsFragment;
                expect(dataset).toBe(expectedDatasetBasics);
            });

        const datasetOverviewSubscription$ = datasetSubsService.onDatasetOverviewDataChanges
            .pipe(first())
            .subscribe((overviewDataUpdate: OverviewDataUpdate) => {
                const expectedOverview = mockDatasetMainDataResponse.datasets.byOwnerAndName as DatasetOverviewFragment;
                expect(overviewDataUpdate.overview).toEqual(expectedOverview);

                const expectedSize = mockDatasetMainDataResponse.datasets.byOwnerAndName
                    ?.data as DatasetDataSizeFragment;
                expect(overviewDataUpdate.size).toEqual(expectedSize);
            });

        const datasetDataSubscription$ = datasetSubsService.onDatasetDataChanges.pipe(first()).subscribe();
        const metadataSchemaSubscription$ = datasetSubsService.onMetadataSchemaChanges.pipe(first()).subscribe();
        const lineageDataSubscription$ = datasetSubsService.onLineageDataChanges.pipe(first()).subscribe();

        service.requestDatasetMainData(mockDatasetInfo).subscribe();

        expect(datasetChangesSubscription$.closed).toBeTrue();
        expect(datasetOverviewSubscription$.closed).toBeTrue();
        expect(datasetDataSubscription$.closed).toBeTrue();
        expect(metadataSchemaSubscription$.closed).toBeTrue();
        expect(lineageDataSubscription$.closed).toBeTrue();
    });

    it("should check get main data from api when dataset not found", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(mockDatasetResponseNotFound));

        service.onDatasetChanges.subscribe(() => fail("Unexpected onDatasetChanges update"));
        datasetSubsService.onDatasetOverviewDataChanges.subscribe(() => fail("Unexpected overview update"));
        datasetSubsService.onDatasetDataChanges.subscribe(() => fail("Unexpected data update"));
        datasetSubsService.onMetadataSchemaChanges.subscribe(() => fail("Unexpected metadata update"));
        datasetSubsService.onLineageDataChanges.subscribe(() => fail("Unexpected lineage update"));

        const subscription$ = service
            .requestDatasetMainData(mockDatasetInfo)
            .pipe(first())
            .subscribe(
                () => {
                    fail("Unexpected success");
                },
                (e: Error) => {
                    expect(e).toEqual(new DatasetNotFoundError());
                },
            );
        expect(subscription$.closed).toBeTrue();
    });

    it("should check get main data from api when SQL execution fails softly", () => {
        const executionFailureMessage = "data extraction failed";
        const sqlFailureResponse = _.cloneDeep(mockDatasetMainDataResponse);
        if (sqlFailureResponse.datasets.byOwnerAndName) {
            sqlFailureResponse.datasets.byOwnerAndName.data.tail = {
                __typename: "DataQueryResultError",
                errorMessage: executionFailureMessage,
                errorKind: DataQueryResultErrorKind.InternalError,
            };
        }
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(sqlFailureResponse));

        service.onDatasetChanges.subscribe(() => fail("Unexpected onDatasetChanges update"));
        datasetSubsService.onDatasetOverviewDataChanges.subscribe(() => fail("Unexpected overview update"));
        datasetSubsService.onDatasetDataChanges.subscribe(() => fail("Unexpected data update"));
        datasetSubsService.onMetadataSchemaChanges.subscribe(() => fail("Unexpected metadata update"));
        datasetSubsService.onLineageDataChanges.subscribe(() => fail("Unexpected lineage update"));

        const subscription$ = service
            .requestDatasetMainData(mockDatasetInfo)
            .pipe(first())
            .subscribe(
                () => {
                    fail("Unexpected success");
                },
                (e: Error) => {
                    expect(e).toEqual(new SqlExecutionError(executionFailureMessage));
                },
            );
        expect(subscription$.closed).toBeTrue();
    });

    it("should check get history data from api", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(of(mockDatasetHistoryResponse));

        const subscription$ = datasetSubsService.onDatasetHistoryChanges
            .pipe(first())
            .subscribe((historyUpdate: DatasetHistoryUpdate) => {
                const expectedNodes = mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks
                    .nodes as MetadataBlockFragment[];
                expect(historyUpdate.history).toBe(expectedNodes);
                expect(historyUpdate.pageInfo).toEqual({
                    __typename: "PageBasedInfo",
                    hasNextPage: false,
                    hasPreviousPage: false,
                    currentPage: 1,
                    totalPages: 1,
                });
            });

        service.requestDatasetHistory(mockDatasetInfo, numRecords, numPage).subscribe();

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get history data from api when dataset not found", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(of(mockDatasetResponseNotFound));

        datasetSubsService.onDatasetHistoryChanges.subscribe(() => fail("Unexpected history update"));

        const subscription$ = service
            .requestDatasetHistory(mockDatasetInfo, numRecords, numPage)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => expect(e).toEqual(new DatasetNotFoundError()),
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get SQL query data from api", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunResponse));

        const subscriptionDataChanges$ = datasetSubsService.onDatasetDataChanges.pipe(first()).subscribe();

        const subscriptionErrorChangesSpy = spyOn(datasetSubsService, "observeSqlErrorOccurred");

        service.requestDatasetDataSqlRun({ query, limit }).subscribe();

        expect(subscriptionDataChanges$.closed).toBeTrue();
        expect(subscriptionErrorChangesSpy).toHaveBeenCalledWith({ error: "" });
    });

    it("should check get SQL query data from api with invalid SQL", () => {
        const query = "invalid sql query";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunInvalidSqlResponse));

        const subscriptionDataChanges$ = datasetSubsService.onDatasetDataChanges.pipe(first()).subscribe();

        const subscriptionErrorChanges$ = datasetSubsService.onDatasetDataSqlErrorOccurred
            .pipe(first())
            .subscribe((update: DataSqlErrorUpdate) => {
                const errorResult = mockDatasetDataSqlRunInvalidSqlResponse.data.query as DataQueryResultError;
                expect(update.error).toEqual(errorResult.errorMessage);
            });

        service.requestDatasetDataSqlRun({ query, limit }).subscribe();

        expect(subscriptionDataChanges$.closed).toBeFalse();
        expect(subscriptionErrorChanges$.closed).toBeTrue();
    });

    it("should check get SQL query data from api when SQL execution fails softly", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(of(mockDatasetDataSqlRunInternalErrorResponse));

        datasetSubsService.onDatasetDataChanges.subscribe(() => fail("Unexpected data update"));
        datasetSubsService.onDatasetDataSqlErrorOccurred.subscribe(() => fail("Unexpected SQL error update"));

        const subscription$ = service
            .requestDatasetDataSqlRun({ query, limit })
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

        datasetSubsService.onDatasetDataChanges.subscribe(() => fail("Unexpected data update"));
        datasetSubsService.onDatasetDataSqlErrorOccurred.subscribe(() => fail("Unexpected SQL error update"));

        const subscription$ = service
            .requestDatasetDataSqlRun({ query, limit })
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => expect(e).toEqual(new SqlExecutionError()),
            });
        expect(subscription$.closed).toBeTrue();
    });

    it("should check get dataset basics with permissions", () => {
        spyOn(datasetApi, "getDatasetBasicsWithPermissions").and.returnValue(of(mockDatasetBasicsWithPermissionQuery));

        const permissionsSubscription$ = datasetSubsService.onPermissionsDataChanges
            .pipe(first())
            .subscribe((permissions: DatasetPermissionsFragment) => {
                expect(permissions.permissions).toEqual(mockFullPowerDatasetPermissionsFragment.permissions);
            });

        service.requestDatasetBasicDataWithPermissions(mockDatasetInfo).subscribe();

        expect(permissionsSubscription$.closed).toBeTrue();
    });

    it("should check get dataset basics with permissions when dataset is not found", () => {
        spyOn(datasetApi, "getDatasetBasicsWithPermissions").and.returnValue(of({ datasets: {} }));

        const subscription$ = service.requestDatasetBasicDataWithPermissions(mockDatasetInfo).subscribe({
            next: () => fail("Unexpected success"),
            error: (e: Error) => expect(e instanceof DatasetNotFoundError).toBeTrue(),
        });

        expect(subscription$.closed).toBeTrue();
    });
});
