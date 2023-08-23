import {
    mockDatasetDataSqlRunResponse,
    mockDatasetsByAccountNameQuery,
    mockGetMetadataBlockQuery,
    TEST_BLOCK_HASH,
    TEST_DATASET_NAME,
    TEST_USER_NAME,
} from "./mock/dataset.mock";
import {
    mockCommitEventResponse,
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
} from "./../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "./dataset.api";
import {
    CommitEventToDatasetDocument,
    CommitEventToDatasetMutation,
    DatasetsByAccountNameDocument,
    DatasetsByAccountNameQuery,
    GetDatasetDataSqlRunDocument,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryDocument,
    GetDatasetHistoryQuery,
    GetDatasetMainDataDocument,
    GetDatasetMainDataQuery,
    GetMetadataBlockDocument,
    GetMetadataBlockQuery,
} from "./kamu.graphql.interface";
import { MaybeNullOrUndefined } from "../common/app.types";

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
                expect(res.datasets.byOwnerAndName?.name).toEqual("alberta.case-details");
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
                const actualQuery = res.data.query;
                const expectedQuery = mockDatasetDataSqlRunResponse.data.query;
                if (
                    actualQuery.__typename === "DataQueryResultSuccess" &&
                    expectedQuery.__typename === "DataQueryResultSuccess"
                ) {
                    expect(actualQuery.data.content).toEqual(expectedQuery.data.content);
                } else {
                    fail("expecting successful query");
                }
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
                expect(res.datasets.byOwnerAndName?.metadata.chain.blocks.totalCount).toEqual(
                    mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks.totalCount,
                );
            });

        const op = controller.expectOne(GetDatasetHistoryDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_USER_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetHistoryResponse,
        });
    });

    it("should extract datasets by account name", () => {
        service.fetchDatasetsByAccountName(TEST_USER_NAME).subscribe((res: DatasetsByAccountNameQuery) => {
            expect(res.datasets.byAccountName.totalCount).toEqual(
                mockDatasetsByAccountNameQuery.datasets.byAccountName.totalCount,
            );
            expect(res.datasets.byAccountName.nodes[0].name).toEqual(
                mockDatasetsByAccountNameQuery.datasets.byAccountName.nodes[0].name,
            );
        });

        const op = controller.expectOne(DatasetsByAccountNameDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_USER_NAME);

        op.flush({
            data: mockDatasetsByAccountNameQuery,
        });
    });

    it("should load block by hash", () => {
        const blockByHash = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash;
        service
            .getBlockByHash({
                accountName: TEST_USER_NAME,
                datasetName: TEST_DATASET_NAME,
                blockHash: TEST_BLOCK_HASH,
            })
            .subscribe((res: GetMetadataBlockQuery) => {
                expect(res.datasets.byOwnerAndName?.metadata.chain.blockByHash?.blockHash).toEqual(
                    blockByHash?.blockHash,
                );
                expect(res.datasets.byOwnerAndName?.metadata.chain.blockByHash?.author.name).toEqual(
                    blockByHash?.author.name,
                );
            });

        const op = controller.expectOne(GetMetadataBlockDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_USER_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        expect(op.operation.variables.blockHash).toEqual(TEST_BLOCK_HASH);
        op.flush({
            data: mockGetMetadataBlockQuery,
        });
    });

    it("should commit event", () => {
        const mockDatasetId = "mockId";
        const mockEvent = "mock event";
        service
            .commitEvent({
                datasetId: mockDatasetId,
                event: mockEvent,
            })
            .subscribe((res: MaybeNullOrUndefined<CommitEventToDatasetMutation>) => {
                expect(res?.datasets.byId?.metadata.chain.commitEvent.__typename).toEqual("CommitResultSuccess");
            });

        const op = controller.expectOne(CommitEventToDatasetDocument);
        expect(op.operation.variables.datasetId).toEqual(mockDatasetId);
        expect(op.operation.variables.event).toEqual(mockEvent);
        op.flush({
            data: mockCommitEventResponse,
        });
    });
});
