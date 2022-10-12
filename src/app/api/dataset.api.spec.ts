import { mockDatasetDataSqlRunResponse } from "./mock/dataset.mock";
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

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be get main dataset data", async () => {
        service
            .getDatasetMainData({
                accountName: "accountName",
                datasetName: "datasetName",
            })
            .subscribe((res: GetDatasetMainDataQuery) => {
                void expect(res.datasets.byOwnerAndName?.name).toEqual(
                    "alberta.case-details",
                );
                void expect(res.datasets.byOwnerAndName?.id).toEqual(
                    "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                );
            });
        const op = controller.expectOne(GetDatasetMainDataDocument);
        await expect(op.operation.variables.accountName).toEqual("accountName");
        await expect(op.operation.variables.datasetName).toEqual("datasetName");
        op.flush({
            data: mockDatasetMainDataResponse,
        });
    });

    it("should get data from sql", async () => {
        service
            .getDatasetDataSqlRun({
                query: "test query",
                limit: 50,
            })
            .subscribe((res: GetDatasetDataSqlRunQuery) => {
                void expect(res.data.query.data.content).toEqual(
                    mockDatasetDataSqlRunResponse.data.query.data.content,
                );
            });
        const op = controller.expectOne(GetDatasetDataSqlRunDocument);
        await expect(op.operation.variables.query).toEqual("test query");
        await expect(op.operation.variables.limit).toEqual(50);
        op.flush({
            data: mockDatasetDataSqlRunResponse,
        });
    });

    it("should get data dataset history", async () => {
        service
            .getDatasetHistory({
                accountName: "accountName",
                datasetName: "datasetName",
                numRecords: 20,
                numPage: 1,
            })
            .subscribe((res: GetDatasetHistoryQuery) => {
                void expect(
                    res.datasets.byOwnerAndName?.metadata.chain.blocks
                        .totalCount,
                ).toEqual(
                    mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata
                        .chain.blocks.totalCount,
                );
            });
        const op = controller.expectOne(GetDatasetHistoryDocument);
        await expect(op.operation.variables.accountName).toEqual("accountName");
        await expect(op.operation.variables.datasetName).toEqual("datasetName");
        op.flush({
            data: mockDatasetHistoryResponse,
        });
    });
});
