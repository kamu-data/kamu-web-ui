/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetHeadBlockHashQuery } from "./../search/mock.data";
import {
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
    mockDatasetResponseNotFound,
    mockDatasetInfo,
    mockFullPowerDatasetPermissionsFragment,
    mockDatasetLineageResponse,
} from "../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import { DatasetApi } from "../api/dataset.api";
import { ModalService } from "../common/components/modal/modal.service";
import { DatasetService } from "./dataset.service";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    DataQueryResultErrorKind,
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { of } from "rxjs";
import { DatasetNotFoundError, SqlExecutionError } from "../common/values/errors";
import { DatasetHistoryUpdate, LineageUpdate, OverviewUpdate } from "./dataset.subscriptions.interface";
import { first } from "rxjs/operators";
import {
    mockDatasetBasicsWithPermissionQuery,
    mockDatasetPushSyncStatusesAllInSyncQuery,
    mockDatasetPushSyncStatusesNoRemotesQuery,
    mockDatasetPushSyncStatusesQuery,
    TEST_ACCOUNT_NAME,
    TEST_DATASET_ID,
    TEST_DATASET_NAME,
} from "../api/mock/dataset.mock";
import { MaybeNull } from "../interface/app.types";

describe("AppDatasetService", () => {
    let service: DatasetService;
    let datasetApi: DatasetApi;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DatasetApi,
                ModalService,
                DatasetService,
                DatasetSubscriptionsService,
                Apollo,
                {
                    provide: APOLLO_OPTIONS,
                    useFactory: () => {
                        return {
                            cache: {
                                evict: () => null,
                            },
                        };
                    },
                },
            ],
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

        const datasetChangesSubscription$ = service.datasetChanges
            .pipe(first())
            .subscribe((dataset: DatasetBasicsFragment) => {
                const expectedDatasetBasics = mockDatasetMainDataResponse.datasets
                    .byOwnerAndName as DatasetBasicsFragment;
                expect(dataset).toBe(expectedDatasetBasics);
            });

        const datasetOverviewSubscription$ = datasetSubsService.overviewChanges
            .pipe(first())
            .subscribe((overviewDataUpdate: OverviewUpdate) => {
                const expectedOverview = mockDatasetMainDataResponse.datasets.byOwnerAndName as DatasetOverviewFragment;
                expect(overviewDataUpdate.overview).toEqual(expectedOverview);

                const expectedSize = mockDatasetMainDataResponse.datasets.byOwnerAndName
                    ?.data as DatasetDataSizeFragment;
                expect(overviewDataUpdate.size).toEqual(expectedSize);
            });

        const metadataSchemaSubscription$ = datasetSubsService.metadataSchemaChanges.pipe(first()).subscribe();

        service.requestDatasetMainData(mockDatasetInfo).subscribe();

        expect(datasetChangesSubscription$.closed).toBeTrue();
        expect(datasetOverviewSubscription$.closed).toBeTrue();
        expect(metadataSchemaSubscription$.closed).toBeTrue();
    });

    it("should check get main data from api nullifies history and lineage", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(mockDatasetMainDataResponse));

        const historyChangesSubscription$ = datasetSubsService.historyChanges
            .pipe(first())
            .subscribe((historyUpdate: MaybeNull<DatasetHistoryUpdate>) => {
                expect(historyUpdate).toBeNull();
            });

        const lineageChangesSubscription$ = datasetSubsService.lineageChanges
            .pipe(first())
            .subscribe((lineageUpdate: MaybeNull<LineageUpdate>) => {
                expect(lineageUpdate).toBeNull();
            });

        service.requestDatasetMainData(mockDatasetInfo).subscribe();

        expect(historyChangesSubscription$.closed).toBeTrue();
        expect(lineageChangesSubscription$.closed).toBeTrue();
    });

    it("should check get main data from api when dataset not found", () => {
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(mockDatasetResponseNotFound));

        service.datasetChanges.subscribe(() => fail("Unexpected onDatasetChanges update"));
        datasetSubsService.overviewChanges.subscribe(() => fail("Unexpected overview update"));
        datasetSubsService.metadataSchemaChanges.subscribe(() => fail("Unexpected metadata update"));

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
        const sqlFailureResponse = structuredClone(mockDatasetMainDataResponse);
        if (sqlFailureResponse.datasets.byOwnerAndName) {
            sqlFailureResponse.datasets.byOwnerAndName.data.tail = {
                __typename: "DataQueryResultError",
                errorMessage: executionFailureMessage,
                errorKind: DataQueryResultErrorKind.InternalError,
            };
        }
        spyOn(datasetApi, "getDatasetMainData").and.returnValue(of(sqlFailureResponse));

        service.datasetChanges.subscribe(() => fail("Unexpected onDatasetChanges update"));
        datasetSubsService.overviewChanges.subscribe(() => fail("Unexpected overview update"));
        datasetSubsService.metadataSchemaChanges.subscribe(() => fail("Unexpected metadata update"));

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

        const subscription$ = datasetSubsService.historyChanges
            .pipe(first())
            .subscribe((historyUpdate: MaybeNull<DatasetHistoryUpdate>) => {
                if (historyUpdate) {
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
                } else {
                    fail("History reset instead of update");
                }
            });

        service.requestDatasetHistory(mockDatasetInfo, numRecords, numPage).subscribe();

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get lineage data from api", () => {
        spyOn(datasetApi, "getDatasetLineage").and.returnValue(of(mockDatasetLineageResponse));

        const subscription$ = datasetSubsService.lineageChanges
            .pipe(first())
            .subscribe((lineageUpdate: MaybeNull<LineageUpdate>) => {
                if (lineageUpdate) {
                    if (mockDatasetLineageResponse.datasets.byOwnerAndName) {
                        const expectedId = mockDatasetLineageResponse.datasets.byOwnerAndName.id;
                        const expectedName = mockDatasetLineageResponse.datasets.byOwnerAndName.name;
                        expect(lineageUpdate.origin.id).toBe(expectedId);
                        expect(lineageUpdate.origin.name).toBe(expectedName);
                    }
                } else {
                    fail("lineage reset instead of update");
                }
            });

        service.requestDatasetLineage(mockDatasetInfo).subscribe();

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get history data from api when dataset not found", () => {
        const numRecords = 7;
        const numPage = 1;
        spyOn(datasetApi, "getDatasetHistory").and.returnValue(of(mockDatasetResponseNotFound));

        datasetSubsService.historyChanges.subscribe(() => fail("Unexpected history update"));

        const subscription$ = service
            .requestDatasetHistory(mockDatasetInfo, numRecords, numPage)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => expect(e).toEqual(new DatasetNotFoundError()),
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get dataset basics with permissions", () => {
        spyOn(datasetApi, "getDatasetBasicsWithPermissions").and.returnValue(of(mockDatasetBasicsWithPermissionQuery));

        const permissionsSubscription$ = datasetSubsService.permissionsChanges
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

    it("should check get hash last block", () => {
        const datasetHashLastBlockSpy = spyOn(datasetApi, "datasetHeadBlockHash").and.returnValue(
            of(mockDatasetHeadBlockHashQuery),
        );
        const requestDatasetHashLastBlockSubscription$ = service
            .requestDatasetHeadBlockHash(TEST_ACCOUNT_NAME, TEST_DATASET_NAME)
            .subscribe((result: string) => {
                expect(result).toEqual(
                    mockDatasetHeadBlockHashQuery.datasets.byOwnerAndName?.metadata.chain.refs[0].blockHash as string,
                );
            });

        expect(requestDatasetHashLastBlockSubscription$.closed).toBeTrue();
        expect(datasetHashLastBlockSpy).toHaveBeenCalledTimes(1);
    });

    it("should return true is there are out of sync push remotes", () => {
        spyOn(datasetApi, "datasetPushSyncStatuses").and.returnValue(of(mockDatasetPushSyncStatusesQuery));

        const subscription$ = service
            .hasOutOfSyncPushRemotes(TEST_DATASET_ID)
            .pipe(first())
            .subscribe((hasOutOfSyncRemotes: boolean) => {
                expect(hasOutOfSyncRemotes).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should return false is there are no out of sync push remotes", () => {
        spyOn(datasetApi, "datasetPushSyncStatuses").and.returnValue(of(mockDatasetPushSyncStatusesAllInSyncQuery));

        const subscription$ = service
            .hasOutOfSyncPushRemotes(TEST_DATASET_ID)
            .pipe(first())
            .subscribe((hasOutOfSyncRemotes: boolean) => {
                expect(hasOutOfSyncRemotes).toBe(false);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should return false is there are no push remotes", () => {
        spyOn(datasetApi, "datasetPushSyncStatuses").and.returnValue(of(mockDatasetPushSyncStatusesNoRemotesQuery));

        const subscription$ = service
            .hasOutOfSyncPushRemotes(TEST_DATASET_ID)
            .pipe(first())
            .subscribe((hasOutOfSyncRemotes: boolean) => {
                expect(hasOutOfSyncRemotes).toBe(false);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
