import {
    mockDatasetDataSqlRunResponse,
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
    mockDatasetResponseNotFound,
    mockDatasetInfo,
} from "./../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetApi } from "../api/dataset.api";
import { ModalService } from "../components/modal/modal.service";
import { AppDatasetService } from "./dataset.service";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { of, throwError } from "rxjs";
import { DatasetNotFoundError, InvalidSqlError } from "../common/errors";
import {
    DatasetHistoryUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { first } from "rxjs/operators";

describe("AppDatasetService", () => {
    let service: AppDatasetService;
    let datasetApi: DatasetApi;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                DatasetApi,
                ModalService,
                AppDatasetService,
                AppDatasetSubscriptionsService,
                Apollo,
            ],
        });
        service = TestBed.inject(AppDatasetService);
        datasetApi = TestBed.inject(DatasetApi);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get main data from api", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(
            of(mockDatasetMainDataResponse),
        );

        const datasetChangesSubscription$ = 
            service.onDatasetChanges
                .pipe(first())
                .subscribe((dataset: DatasetBasicsFragment) => {
                    const expectedDatasetBasics = mockDatasetMainDataResponse.datasets
                                    .byOwnerAndName as DatasetBasicsFragment;
                    expect(dataset).toBe(expectedDatasetBasics);
                });

        const datasetOverviewSubscription$ =
            appDatasetSubsService.onDatasetOverviewDataChanges
                .pipe(first())
                .subscribe((overviewDataUpdate: OverviewDataUpdate) => {
                    const expectedOverview = mockDatasetMainDataResponse.datasets
                        .byOwnerAndName as DatasetOverviewFragment;
                    expect(overviewDataUpdate.overview).toEqual(expectedOverview);

                    const expectedSize = mockDatasetMainDataResponse.datasets
                        .byOwnerAndName?.data as DatasetDataSizeFragment;
                    expect(overviewDataUpdate.size).toEqual(expectedSize);
                },
        );

        const datasetDataSubscription$ = 
            appDatasetSubsService.onDatasetDataChanges
                .pipe(first())
                .subscribe(() => { /* Intentionally blank */ });

        const metadataSchemaSubscription$ =
            appDatasetSubsService.onMetadataSchemaChanges
                .pipe(first())
                .subscribe(() => { /* Intentionally blank */ });

        const lineageDataSubscription$ = 
            appDatasetSubsService.onLineageDataChanges      
                .pipe(first())
                .subscribe(() => { /* Intentionally blank */ });

        service.requestDatasetMainData(mockDatasetInfo).subscribe();

        expect(datasetChangesSubscription$.closed).toBeTrue();
        expect(datasetOverviewSubscription$.closed).toBeTrue();
        expect(datasetDataSubscription$.closed).toBeTrue();
        expect(metadataSchemaSubscription$.closed).toBeTrue();
        expect(lineageDataSubscription$.closed).toBeTrue();
    });

    it("should check get main data from api when dataset not found", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(
            of(mockDatasetResponseNotFound),
        );

        service.onDatasetChanges.subscribe(() =>
            fail("Unexpected onDatasetChanges update"),
        );
        appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(() =>
            fail("Unexpected overview update"),
        );
        appDatasetSubsService.onDatasetDataChanges.subscribe(() =>
            fail("Unexpected data update"),
        );
        appDatasetSubsService.onMetadataSchemaChanges.subscribe(() =>
            fail("Unexpected metadata update"),
        );
        appDatasetSubsService.onLineageDataChanges.subscribe(() =>
            fail("Unexpected lineage update"),
        );

        const subscription$ = service.requestDatasetMainData(mockDatasetInfo)
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

    it("should check get history data from api", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(
            of(mockDatasetHistoryResponse),
        );

        const subscription$ = appDatasetSubsService.onDatasetHistoryChanges.pipe(first()).subscribe(
            (historyUpdate: DatasetHistoryUpdate) => {
                const expectedNodes = mockDatasetHistoryResponse.datasets
                    .byOwnerAndName?.metadata.chain.blocks
                    .nodes as MetadataBlockFragment[];
                expect(historyUpdate.history).toBe(expectedNodes);
                expect(historyUpdate.pageInfo).toEqual({
                    __typename: "PageBasedInfo",
                    hasNextPage: false,
                    hasPreviousPage: false,
                    currentPage: 1,
                    totalPages: 1,
                });
            },
        );

        service
            .requestDatasetHistory(mockDatasetInfo, numRecords, numPage)
            .subscribe();

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get history data from api when dataset not found", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(
            of(mockDatasetResponseNotFound),
        );

        appDatasetSubsService.onDatasetHistoryChanges.subscribe(() =>
            fail("Unexpected history update"),
        );

        const subscription$ = service
            .requestDatasetHistory(mockDatasetInfo, numRecords, numPage)
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

    it("should check get SQL query data from api", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(
            of(mockDatasetDataSqlRunResponse),
        );

        const subscription$ = appDatasetSubsService.onDatasetDataChanges.pipe(first()).subscribe(
            () => { /* Intentionally blank */ }
        );

        service.requestDatasetDataSqlRun(query, limit).subscribe();

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get SQL query data from api when invalid SQL", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(
            throwError(new InvalidSqlError()),
        );

        appDatasetSubsService.onDatasetDataChanges.subscribe(() =>
            fail("Unexpected data update"),
        );

        const subscription$ = service.requestDatasetDataSqlRun(query, limit).pipe(first()).subscribe(
            () => {
                fail("Unexpected success");
            },
            (e: Error) => {
                expect(e).toEqual(new InvalidSqlError());
            },
        );
        expect(subscription$.closed).toBeTrue();
    });
});
