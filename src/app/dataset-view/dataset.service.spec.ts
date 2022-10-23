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

        let datasetUpdated = false;
        service.onDatasetChanges.subscribe((dataset: DatasetBasicsFragment) => {
            datasetUpdated = true;
            const expectedDatasetBasics = mockDatasetMainDataResponse.datasets
                .byOwnerAndName as DatasetBasicsFragment;
            expect(dataset).toBe(expectedDatasetBasics);
        });

        let overviewTabDataUpdated = false;
        appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
            (overviewDataUpdate: OverviewDataUpdate) => {
                overviewTabDataUpdated = true;
                const expectedOverview = mockDatasetMainDataResponse.datasets
                    .byOwnerAndName as DatasetOverviewFragment;
                expect(overviewDataUpdate.overview).toEqual(
                    expectedOverview,
                );

                const expectedSize = mockDatasetMainDataResponse.datasets
                    .byOwnerAndName?.data as DatasetDataSizeFragment;
                expect(overviewDataUpdate.size).toEqual(expectedSize);
            },
        );

        let dataUpdated = false;
        appDatasetSubsService.onDatasetDataChanges.subscribe(() => {
            dataUpdated = true;
        });

        let metadataUpdated = false;
        appDatasetSubsService.onMetadataSchemaChanges.subscribe(() => {
            metadataUpdated = true;
        });

        let lineageUpdated = false;
        appDatasetSubsService.onLineageDataChanges.subscribe(() => {
            lineageUpdated = true;
        });

        service.requestDatasetMainData(mockDatasetInfo).subscribe();

        expect(datasetUpdated).toBeTruthy();
        expect(overviewTabDataUpdated).toBeTruthy();
        expect(dataUpdated).toBeTruthy();
        expect(metadataUpdated).toBeTruthy();
        expect(lineageUpdated).toBeTruthy();
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

        let errorHandled = false;
        service.requestDatasetMainData(mockDatasetInfo).subscribe(
            () => {
                fail("Unexpected success");
            },
            (e: Error) => {
                errorHandled = true;
                expect(e).toEqual(new DatasetNotFoundError());
            },
        );
        expect(errorHandled).toBeTruthy();
    });

    it("should check get history data from api", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(
            of(mockDatasetHistoryResponse),
        );

        let historyUpdated = false;
        appDatasetSubsService.onDatasetHistoryChanges.subscribe(
            (historyUpdate: DatasetHistoryUpdate) => {
                historyUpdated = true;
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

        expect(historyUpdated).toBeTruthy();
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

        let errorHandled = false;
        service
            .requestDatasetHistory(mockDatasetInfo, numRecords, numPage)
            .subscribe(
                () => {
                    fail("Unexpected success");
                },
                (e: Error) => {
                    errorHandled = true;
                    expect(e).toEqual(new DatasetNotFoundError());
                },
            );
        expect(errorHandled).toBeTruthy();
    });

    it("should check get SQL query data from api", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        spyOn(datasetApi, "getDatasetDataSqlRun").and.returnValue(
            of(mockDatasetDataSqlRunResponse),
        );

        let dataUpdated = false;
        appDatasetSubsService.onDatasetDataChanges.subscribe(() => {
            dataUpdated = true;
        });

        service.requestDatasetDataSqlRun(query, limit).subscribe();

        expect(dataUpdated).toBeTruthy();
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

        let errorHandled = false;
        service.requestDatasetDataSqlRun(query, limit).subscribe(
            () => {
                fail("Unexpected success");
            },
            (e: Error) => {
                errorHandled = true;
                expect(e).toEqual(new InvalidSqlError());
            },
        );
        expect(errorHandled).toBeTruthy();
    });
});
