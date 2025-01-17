import {
    mockDatasetBasicsWithPermissionQuery,
    mockDatasetByAccountAndDatasetNameQuery,
    mockDatasetDataSqlRunResponse,
    mockDatasetsByAccountNameQuery,
    mockDatasetByIdQuery,
    mockGetMetadataBlockQuery,
    TEST_BLOCK_HASH,
    TEST_DATASET_ID,
    TEST_DATASET_NAME,
    TEST_WATERMARK,
    TEST_ACCOUNT_NAME,
    mockDatasetPushSyncStatusesQuery,
} from "./mock/dataset.mock";
import {
    MOCK_NEW_DATASET_NAME,
    mockCommitEventResponse,
    mockCreateDatasetFromSnapshotResponse,
    mockCreateEmptyDatasetResponse,
    mockDataset403OperationError,
    mockDatasetHeadBlockHashQuery,
    mockDatasetHistoryResponse,
    mockDatasetLineageResponse,
    mockDatasetMainDataResponse,
    mockDeleteSuccessResponse,
    mockFullPowerDatasetPermissionsFragment,
    mockRenameSuccessResponse,
    mockUpdateReadmeSuccessResponse,
    mockUpdateWatermarkSuccessResponse,
} from "../search/mock.data";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "./dataset.api";
import {
    CommitEventToDatasetDocument,
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotDocument,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetDocument,
    CreateEmptyDatasetMutation,
    DataSchemaFormat,
    DatasetByAccountAndDatasetNameDocument,
    DatasetByAccountAndDatasetNameQuery,
    DatasetByIdDocument,
    DatasetByIdQuery,
    DatasetHeadBlockHashDocument,
    DatasetHeadBlockHashQuery,
    DatasetKind,
    DatasetPushSyncStatusesDocument,
    DatasetPushSyncStatusesQuery,
    DatasetsByAccountNameDocument,
    DatasetsByAccountNameQuery,
    DatasetVisibility,
    DeleteDatasetDocument,
    DeleteDatasetMutation,
    GetDatasetBasicsWithPermissionsDocument,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetDataSqlRunDocument,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryDocument,
    GetDatasetHistoryQuery,
    GetDatasetLineageDocument,
    GetDatasetLineageQuery,
    GetDatasetMainDataDocument,
    GetDatasetMainDataQuery,
    GetDatasetSchemaDocument,
    GetDatasetSchemaQuery,
    GetMetadataBlockDocument,
    GetMetadataBlockQuery,
    RenameDatasetDocument,
    RenameDatasetMutation,
    UpdateReadmeDocument,
    UpdateReadmeMutation,
    UpdateWatermarkDocument,
    UpdateWatermarkMutation,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_ID, TEST_LOGIN } from "./mock/auth.mock";
import { first, Observable } from "rxjs";
import { DocumentNode } from "graphql";
import { mockGetDatasetSchemaQuery } from "../dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import AppValues from "../common/app.values";
import { ApolloError } from "@apollo/client/core";

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

    it("should query dataset main data", fakeAsync(() => {
        const subscription$ = service
            .getDatasetMainData({
                accountName: TEST_LOGIN,
                datasetName: TEST_DATASET_NAME,
            })
            .subscribe((res: GetDatasetMainDataQuery) => {
                expect(res.datasets.byOwnerAndName?.name).toEqual("alberta.case-details");
                expect(res.datasets.byOwnerAndName?.id).toEqual(
                    "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
                );
            });

        const op = controller.expectOne(GetDatasetMainDataDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        expect(op.operation.variables.limit).toEqual(AppValues.SAMPLE_DATA_LIMIT);

        op.flush({
            data: mockDatasetMainDataResponse,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should run limited SQL query", fakeAsync(() => {
        const TEST_QUERY = "test query";
        const TEST_LIMIT = 38;
        const subscription$ = service
            .getDatasetDataSqlRun({
                query: TEST_QUERY,
                limit: TEST_LIMIT,
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
        expect(op.operation.variables.limit).toEqual(TEST_LIMIT);

        op.flush({
            data: mockDatasetDataSqlRunResponse,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should run SQL query with default limits", fakeAsync(() => {
        const TEST_QUERY = "test query";
        const subscription$ = service
            .getDatasetDataSqlRun({
                query: TEST_QUERY,
            })
            .subscribe();

        const op = controller.expectOne(GetDatasetDataSqlRunDocument);
        expect(op.operation.variables.query).toEqual(TEST_QUERY);
        expect(op.operation.variables.limit).toEqual(AppValues.SQL_QUERY_LIMIT);

        op.flush({
            data: mockDatasetDataSqlRunResponse,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset history", fakeAsync(() => {
        const subscription$ = service
            .getDatasetHistory({
                accountName: TEST_LOGIN,
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
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetHistoryResponse,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset lineage", fakeAsync(() => {
        const subscription$ = service
            .getDatasetLineage({
                accountName: TEST_LOGIN,
                datasetName: TEST_DATASET_NAME,
            })
            .subscribe((res: GetDatasetLineageQuery) => {
                expect(res.datasets.byOwnerAndName?.name).toEqual(
                    mockDatasetLineageResponse.datasets.byOwnerAndName?.name,
                );
            });

        const op = controller.expectOne(GetDatasetLineageDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetLineageResponse,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset info by id", fakeAsync(() => {
        const subscription$ = service.getDatasetInfoById(TEST_DATASET_ID).subscribe((res: DatasetByIdQuery) => {
            expect(res.datasets.byId?.id).toEqual(TEST_DATASET_ID);
        });

        const op = controller.expectOne(DatasetByIdDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockDatasetByIdQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset basics with permissions by account and dataset name", fakeAsync(() => {
        const subscription$ = service
            .getDatasetBasicsWithPermissions({ accountName: TEST_LOGIN, datasetName: TEST_DATASET_NAME })
            .subscribe((res: GetDatasetBasicsWithPermissionsQuery) => {
                expect(res.datasets.byOwnerAndName?.name).toEqual(TEST_DATASET_NAME);
                expect(res.datasets.byOwnerAndName?.permissions).toEqual(
                    mockFullPowerDatasetPermissionsFragment.permissions,
                );
            });

        const op = controller.expectOne(GetDatasetBasicsWithPermissionsDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetBasicsWithPermissionQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset schema by ID", fakeAsync(() => {
        const subscription$ = service.getDatasetSchema(TEST_DATASET_ID).subscribe((res: GetDatasetSchemaQuery) => {
            expect(res.datasets.byId?.metadata.currentSchema?.format).toEqual(DataSchemaFormat.ParquetJson);
        });

        const op = controller.expectOne(GetDatasetSchemaDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockGetDatasetSchemaQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract datasets by account name", fakeAsync(() => {
        const subscription$ = service
            .fetchDatasetsByAccountName(TEST_LOGIN)
            .subscribe((res: DatasetsByAccountNameQuery) => {
                expect(res.datasets.byAccountName.totalCount).toEqual(
                    mockDatasetsByAccountNameQuery.datasets.byAccountName.totalCount,
                );
                expect(res.datasets.byAccountName.nodes[0].name).toEqual(
                    mockDatasetsByAccountNameQuery.datasets.byAccountName.nodes[0].name,
                );
            });

        const op = controller.expectOne(DatasetsByAccountNameDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);

        op.flush({
            data: mockDatasetsByAccountNameQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should extract dataset by account and dataset names", fakeAsync(() => {
        const subscription$ = service
            .getDatasetInfoByAccountAndDatasetName(TEST_LOGIN, TEST_DATASET_NAME)
            .subscribe((res: DatasetByAccountAndDatasetNameQuery) => {
                expect(res.datasets.byOwnerAndName?.owner.accountName).toEqual(TEST_LOGIN);
                expect(res.datasets.byOwnerAndName?.name).toEqual(TEST_DATASET_NAME);
            });

        const op = controller.expectOne(DatasetByAccountAndDatasetNameDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);

        op.flush({
            data: mockDatasetByAccountAndDatasetNameQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    it("should load block by hash", fakeAsync(() => {
        const blockByHash = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash;
        const subscription$ = service
            .getBlockByHash({
                accountName: TEST_LOGIN,
                datasetName: TEST_DATASET_NAME,
                blockHash: TEST_BLOCK_HASH,
            })
            .subscribe((res: GetMetadataBlockQuery) => {
                expect(res.datasets.byOwnerAndName?.metadata.chain.blockByHash?.blockHash).toEqual(
                    blockByHash?.blockHash,
                );
                expect(res.datasets.byOwnerAndName?.metadata.chain.blockByHash?.author.accountName).toEqual(
                    blockByHash?.author.accountName,
                );
            });

        const op = controller.expectOne(GetMetadataBlockDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        expect(op.operation.variables.blockHash).toEqual(TEST_BLOCK_HASH);
        op.flush({
            data: mockGetMetadataBlockQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);
        flush();
    }));

    [DatasetKind.Root, DatasetKind.Derivative].forEach((datasetKind: DatasetKind) => {
        it(`should create empty ${datasetKind} dataset`, fakeAsync(() => {
            const mockDatasetAlias = "my-test";
            const subscription$ = service
                .createEmptyDataset({
                    datasetKind,
                    datasetAlias: mockDatasetAlias,
                    datasetVisibility: DatasetVisibility.Public,
                })
                .pipe(first())
                .subscribe((res: CreateEmptyDatasetMutation) => {
                    expect(res.datasets.createEmpty.__typename).toEqual("CreateDatasetResultSuccess");
                });

            const op = controller.expectOne(CreateEmptyDatasetDocument);
            expect(op.operation.variables.datasetAlias).toEqual(mockDatasetAlias);
            expect(op.operation.variables.datasetKind).toEqual(datasetKind);
            op.flush({
                data: mockCreateEmptyDatasetResponse,
            });

            tick();

            expect(subscription$.closed).toBeTrue();
            flush();
        }));
    });

    it("should create dataset from snapshot", fakeAsync(() => {
        const mockSnapshot = "snapshot";
        const subscription = service
            .createDatasetFromSnapshot({ snapshot: mockSnapshot, datasetVisibility: DatasetVisibility.Public })
            .pipe(first())
            .subscribe((res: CreateDatasetFromSnapshotMutation) => {
                expect(res.datasets.createFromSnapshot.__typename).toEqual("CreateDatasetResultSuccess");
            });

        const op = controller.expectOne(CreateDatasetFromSnapshotDocument);
        expect(op.operation.variables.snapshot).toEqual(mockSnapshot);
        expect(op.operation.variables.datasetVisibility).toEqual(DatasetVisibility.Public);
        op.flush({
            data: mockCreateDatasetFromSnapshotResponse,
        });

        tick();

        expect(subscription.closed).toBeTrue();
        flush();
    }));

    it("should successfully commit event", () => {
        const mockEvent = "mock event";
        service
            .commitEvent({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                event: mockEvent,
            })
            .subscribe((res: CommitEventToDatasetMutation) => {
                expect(res.datasets.byId?.metadata.chain.commitEvent.__typename).toEqual("CommitResultSuccess");
            });

        const op = controller.expectOne(CommitEventToDatasetDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.event).toEqual(mockEvent);
        op.flush({
            data: mockCommitEventResponse,
        });
    });

    it("should successfully update dataset's readme", () => {
        const mockReadmeContent = "someReadme";
        service
            .updateReadme({ accountId: TEST_ACCOUNT_ID, datasetId: TEST_DATASET_ID, content: mockReadmeContent })
            .subscribe((res: UpdateReadmeMutation) => {
                expect(res.datasets.byId?.metadata.updateReadme.__typename).toEqual("CommitResultSuccess");
            });

        const op = controller.expectOne(UpdateReadmeDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.content).toEqual(mockReadmeContent);
        op.flush({
            data: mockUpdateReadmeSuccessResponse,
        });
    });

    it("should successfully delete dataset", () => {
        service
            .deleteDataset({ accountId: TEST_ACCOUNT_ID, datasetId: TEST_DATASET_ID })
            .subscribe((res: DeleteDatasetMutation) => {
                expect(res.datasets.byId?.delete.message).toEqual("Success");
            });

        const op = controller.expectOne(DeleteDatasetDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDeleteSuccessResponse,
        });
    });

    it("should successfully fetch hash last block", () => {
        service
            .datasetHeadBlockHash(TEST_ACCOUNT_NAME, TEST_DATASET_NAME)
            .subscribe((res: DatasetHeadBlockHashQuery) => {
                const refHeadBlock = res.datasets.byOwnerAndName?.metadata.chain.refs.find(
                    (item) => item.name === "head",
                );
                expect(refHeadBlock?.blockHash).toEqual(
                    mockDatasetHeadBlockHashQuery.datasets.byOwnerAndName?.metadata.chain.refs[0].blockHash,
                );
            });

        const op = controller.expectOne(DatasetHeadBlockHashDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_ACCOUNT_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        op.flush({
            data: mockDatasetHeadBlockHashQuery,
        });
    });

    it("should successfully rename dataset", () => {
        service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                newName: MOCK_NEW_DATASET_NAME,
            })
            .subscribe((res: RenameDatasetMutation) => {
                expect(res.datasets.byId?.rename.__typename).toEqual("RenameResultSuccess");
            });

        const op = controller.expectOne(RenameDatasetDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.newName).toEqual(MOCK_NEW_DATASET_NAME);
        op.flush({
            data: mockRenameSuccessResponse,
        });
    });

    it("should successfully update watermark", () => {
        service
            .setWatermark({
                datasetId: TEST_DATASET_ID,
                watermark: TEST_WATERMARK,
                accountId: TEST_ACCOUNT_ID,
            })
            .subscribe((res: UpdateWatermarkMutation) => {
                expect(res.datasets.byId?.setWatermark.message).toEqual("Success");
            });

        const op = controller.expectOne(UpdateWatermarkDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.watermark).toEqual(TEST_WATERMARK);
        op.flush({
            data: mockUpdateWatermarkSuccessResponse,
        });
    });

    it("should extract push remotes sync statuses by id", fakeAsync(() => {
        const subscription$ = service
            .datasetPushSyncStatuses(TEST_DATASET_ID)
            .subscribe((res: DatasetPushSyncStatusesQuery) => {
                expect(res.datasets.byId?.metadata.pushSyncStatuses.__typename).toEqual("DatasetPushStatuses");
            });

        const op = controller.expectOne(DatasetPushSyncStatusesDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockDatasetPushSyncStatusesQuery,
        });

        tick();

        expect(subscription$.closed).toEqual(true);

        flush();
    }));

    interface RuntimeFailureTestCase {
        operationName: string;
        expectedGqlQuery: DocumentNode;
        action(): Observable<unknown>;
    }

    [
        {
            operationName: "createEmpty",
            expectedGqlQuery: CreateEmptyDatasetDocument,
            action: (): Observable<unknown> => {
                return service.createEmptyDataset({
                    datasetKind: DatasetKind.Root,
                    datasetAlias: MOCK_NEW_DATASET_NAME,
                    datasetVisibility: DatasetVisibility.Public,
                });
            },
        },
        {
            operationName: "createFromSnapshot",
            expectedGqlQuery: CreateDatasetFromSnapshotDocument,
            action: (): Observable<unknown> => {
                return service.createDatasetFromSnapshot({
                    snapshot: "someSnapshot",
                    datasetVisibility: DatasetVisibility.Public,
                });
            },
        },
        {
            operationName: "rename",
            expectedGqlQuery: RenameDatasetDocument,
            action: (): Observable<unknown> => {
                return service.renameDataset({
                    accountId: TEST_ACCOUNT_ID,
                    datasetId: TEST_DATASET_ID,
                    newName: MOCK_NEW_DATASET_NAME,
                });
            },
        },
        {
            operationName: "delete",
            expectedGqlQuery: DeleteDatasetDocument,
            action: (): Observable<unknown> =>
                service.deleteDataset({ accountId: TEST_ACCOUNT_ID, datasetId: TEST_DATASET_ID }),
        },
        {
            operationName: "updateReadme",
            expectedGqlQuery: UpdateReadmeDocument,
            action: (): Observable<unknown> =>
                service.updateReadme({
                    accountId: TEST_ACCOUNT_ID,
                    datasetId: TEST_DATASET_ID,
                    content: "someReadmeCntent",
                }),
        },
        {
            operationName: "commitEvent",
            expectedGqlQuery: CommitEventToDatasetDocument,
            action: (): Observable<unknown> =>
                service.commitEvent({ accountId: TEST_ACCOUNT_ID, datasetId: TEST_DATASET_ID, event: "someEvent" }),
        },
    ].forEach((testCase: RuntimeFailureTestCase) => {
        it(`should check how operation #${testCase.operationName} is handling runtime error`, fakeAsync(() => {
            const subscription$ = testCase
                .action()
                .pipe(first())
                .subscribe({
                    next: () => fail("Unexpected success"),
                    error: (e: Error) => {
                        expect(e).toEqual(new ApolloError({ graphQLErrors: [mockDataset403OperationError] }));
                    },
                });

            const op = controller.expectOne(testCase.expectedGqlQuery);
            op.graphqlErrors([mockDataset403OperationError]);

            tick();

            expect(subscription$.closed).toBeTrue();
            flush();
        }));
    });
});
