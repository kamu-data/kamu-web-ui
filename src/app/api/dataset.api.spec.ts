import {
    mockDatasetDataSqlRunResponse,
    TEST_DATASET_NAME,
    TEST_USER_NAME,
} from "./mock/dataset.mock";
import {
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
} from "./../search/mock.data";
import { TestBed } from "@angular/core/testing";
import {
    ApolloTestingController,
    ApolloTestingModule,
} from "apollo-angular/testing";
import { DatasetApi } from "./dataset.api";
import {
    GetDatasetDataSqlRunDocument,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryDocument,
    GetDatasetHistoryQuery,
    GetDatasetMainDataDocument,
    GetDatasetMainDataQuery,
} from "./kamu.graphql.interface";

describe("DatasetApi", () => {
    let service: DatasetApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatasetApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should query dataset main data", () => {
        service
            .getDatasetMainData({
                accountName: TEST_USER_NAME,
                datasetName: TEST_DATASET_NAME,
            })
            .subscribe((res: GetDatasetMainDataQuery) => {
                expect(res.datasets.byOwnerAndName?.name).toEqual(
                    "alberta.case-details",
                );
                expect(res.datasets.byOwnerAndName?.id).toEqual(
                    "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                );
            });

        const op = controller.expectOne(GetDatasetMainDataDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_USER_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetMainDataResponse,
        });
    });

    it("should run SQL query", () => {
        const TEST_QUERY = "test query";
        service
            .getDatasetDataSqlRun({
                query: TEST_QUERY,
                limit: 50,
            })
            .subscribe((res: GetDatasetDataSqlRunQuery) => {
                expect(res.data.query.data.content).toEqual(
                    mockDatasetDataSqlRunResponse.data.query.data.content,
                );
            });

        const op = controller.expectOne(GetDatasetDataSqlRunDocument);
        expect(op.operation.variables.query).toEqual(TEST_QUERY);
        expect(op.operation.variables.limit).toEqual(50);

        op.flush({
            data: mockDatasetDataSqlRunResponse,
        });
    });

    it("should extract dataset history", () => {
        service
            .getDatasetHistory({
                accountName: TEST_USER_NAME,
                datasetName: TEST_DATASET_NAME,
                numRecords: 20,
                numPage: 1,
            })
            .subscribe((res: GetDatasetHistoryQuery) => {
                expect(
                    res.datasets.byOwnerAndName?.metadata.chain.blocks
                        .totalCount,
                ).toEqual(
                    mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata
                        .chain.blocks.totalCount,
                );
            });

        const op = controller.expectOne(GetDatasetHistoryDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_USER_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetHistoryResponse,
        });
    });
});
