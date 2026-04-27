/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";

import { StoreObject } from "@apollo/client/cache";
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";

import { resetCacheHelper, updateCacheHelper } from "@common/helpers/apollo-cache.helper";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import {
    CommitEventToDatasetGQL,
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotGQL,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetGQL,
    CreateEmptyDatasetMutation,
    DatasetAsCollectionGQL,
    DatasetAsCollectionQuery,
    DatasetAsVersionedFileByBlockHashQuery,
    DatasetAsVersionedFileByVersionGQL,
    DatasetAsVersionedFileByVersionQuery,
    DatasetAsVersionedFileQuery,
    DatasetBlocksByEventTypeGQL,
    DatasetBlocksByEventTypeQuery,
    DatasetByAccountAndDatasetNameGQL,
    DatasetByAccountAndDatasetNameQuery,
    DatasetByIdGQL,
    DatasetByIdQuery,
    DatasetHeadBlockHashGQL,
    DatasetHeadBlockHashQuery,
    DatasetKind,
    DatasetListDownstreamsGQL,
    DatasetListDownstreamsQuery,
    DatasetPushSyncStatusesGQL,
    DatasetPushSyncStatusesQuery,
    DatasetsByAccountNameGQL,
    DatasetsByAccountNameQuery,
    DatasetsTotalCountByAccountNameGQL,
    DatasetsTotalCountByAccountNameQuery,
    DatasetSystemTimeBlockByHashGQL,
    DatasetSystemTimeBlockByHashQuery,
    DatasetVisibility,
    DatasetVisibilityInput,
    DeleteDatasetGQL,
    DeleteDatasetMutation,
    GetDatasetBasicsWithPermissionsGQL,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetDataSqlRunGQL,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryGQL,
    GetDatasetHistoryQuery,
    GetDatasetLineageGQL,
    GetDatasetLineageQuery,
    GetDatasetMainDataGQL,
    GetDatasetMainDataQuery,
    GetDatasetSchemaGQL,
    GetDatasetSchemaQuery,
    GetMetadataBlockGQL,
    GetMetadataBlockQuery,
    MetadataEventType,
    MetadataManifestFormat,
    RenameDatasetGQL,
    RenameDatasetMutation,
    SetVisibilityDatasetGQL,
    SetVisibilityDatasetMutation,
    UpdateReadmeGQL,
    UpdateReadmeMutation,
    UpdateWatermarkGQL,
    UpdateWatermarkMutation,
    VersionedFileContentUrlGQL,
    VersionedFileContentUrlQuery,
} from "@api/kamu.graphql.interface";
import { DatasetRequestBySql } from "@interface/dataset.interface";

import { DatasetAsVersionedFileByBlockHashGQL, DatasetAsVersionedFileGQL } from "./kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class DatasetApi {
    private datasetMainDataGQL = inject(GetDatasetMainDataGQL);
    private datasetBasicsWithPermissionGQL = inject(GetDatasetBasicsWithPermissionsGQL);
    private datasetDataSqlRunGQL = inject(GetDatasetDataSqlRunGQL);
    private datasetHistoryGQL = inject(GetDatasetHistoryGQL);
    private datasetsByAccountNameGQL = inject(DatasetsByAccountNameGQL);
    private datasetsTotalCountByAccountNameGQL = inject(DatasetsTotalCountByAccountNameGQL);
    private metadataBlockGQL = inject(GetMetadataBlockGQL);
    private datasetByIdGQL = inject(DatasetByIdGQL);
    private datasetByAccountAndDatasetNameGQL = inject(DatasetByAccountAndDatasetNameGQL);
    private createEmptyDatasetGQL = inject(CreateEmptyDatasetGQL);
    private createDatasetFromSnapshotGQL = inject(CreateDatasetFromSnapshotGQL);
    private commitEventToDatasetGQL = inject(CommitEventToDatasetGQL);
    private datasetSchemaGQL = inject(GetDatasetSchemaGQL);
    private updateReadmeGQL = inject(UpdateReadmeGQL);
    private deleteDatasetGQL = inject(DeleteDatasetGQL);
    private renameDatasetGQL = inject(RenameDatasetGQL);
    private datasetLineageGQL = inject(GetDatasetLineageGQL);
    private updateWatermarkGQL = inject(UpdateWatermarkGQL);
    private setVisibilityDatasetGQL = inject(SetVisibilityDatasetGQL);
    private datasetHeadBlockHashGQL = inject(DatasetHeadBlockHashGQL);
    private datasetSystemTimeBlockByHashGQL = inject(DatasetSystemTimeBlockByHashGQL);
    private datasetPushSyncStatusesGQL = inject(DatasetPushSyncStatusesGQL);
    private datasetListDownstreamsGQL = inject(DatasetListDownstreamsGQL);
    private datasetBlocksByEventTypeGQL = inject(DatasetBlocksByEventTypeGQL);
    private datasetAsVersionedFileGQL = inject(DatasetAsVersionedFileGQL);
    private datasetAsVersionedFileByVersionGQL = inject(DatasetAsVersionedFileByVersionGQL);
    private datasetAsVersionedFileByBlockHashGQL = inject(DatasetAsVersionedFileByBlockHashGQL);
    private versionedFileContentUrlGQL = inject(VersionedFileContentUrlGQL);
    private datasetAsCollectionGQL = inject(DatasetAsCollectionGQL);

    public getBlocksByEventType(params: {
        accountName: string;
        datasetName: string;
        eventTypes: [MetadataEventType];
        encoding: MetadataManifestFormat;
    }): Observable<DatasetBlocksByEventTypeQuery> {
        return this.datasetBlocksByEventTypeGQL
            .watch({
                variables: { ...params },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetBlocksByEventTypeQuery>) => {
                    return result.data as DatasetBlocksByEventTypeQuery;
                }),
            );
    }

    public getDatasetMainData(params: {
        accountName: string;
        datasetName: string;
        numRecords?: number;
    }): Observable<GetDatasetMainDataQuery> {
        return this.datasetMainDataGQL
            .watch({
                variables: {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                    limit: params.numRecords ?? AppValues.SAMPLE_DATA_LIMIT,
                },
                fetchPolicy: "cache-first",
                errorPolicy: "all",
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetMainDataQuery>) => {
                    return result.data as GetDatasetMainDataQuery;
                }),
            );
    }

    public getDatasetDataSqlRun(params: DatasetRequestBySql): Observable<GetDatasetDataSqlRunQuery> {
        return this.datasetDataSqlRunGQL
            .watch({
                variables: { query: params.query, limit: params.limit ?? AppValues.SQL_QUERY_LIMIT, skip: params.skip },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetDataSqlRunQuery>) => {
                    return result.data as GetDatasetDataSqlRunQuery;
                }),
            );
    }

    public getDatasetBasicsWithPermissions(params: {
        accountName: string;
        datasetName: string;
    }): Observable<GetDatasetBasicsWithPermissionsQuery> {
        return this.datasetBasicsWithPermissionGQL
            .watch({
                variables: {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetBasicsWithPermissionsQuery>) => {
                    return result.data as GetDatasetBasicsWithPermissionsQuery;
                }),
            );
    }

    public getDatasetHistory(params: {
        accountName: string;
        datasetName: string;
        numRecords: number;
        numPage: number;
    }): Observable<GetDatasetHistoryQuery> {
        return this.datasetHistoryGQL
            .watch({
                variables: {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                    perPage: params.numRecords,
                    page: params.numPage,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetHistoryQuery>) => {
                    return result.data as GetDatasetHistoryQuery;
                }),
            );
    }

    public getDatasetLineage(params: { accountName: string; datasetName: string }): Observable<GetDatasetLineageQuery> {
        return this.datasetLineageGQL
            .watch({
                variables: {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetLineageQuery>) => {
                    return result.data as GetDatasetLineageQuery;
                }),
            );
    }

    public getDatasetSchema(datasetId: string): Observable<GetDatasetSchemaQuery> {
        return this.datasetSchemaGQL
            .watch({
                variables: {
                    datasetId,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetDatasetSchemaQuery>) => {
                    return result.data as GetDatasetSchemaQuery;
                }),
            );
    }

    public fetchDatasetsByAccountName(
        accountName: string,
        page = 0,
        perPage = 10,
    ): Observable<DatasetsByAccountNameQuery> {
        return this.datasetsByAccountNameGQL
            .watch({ variables: { accountName, perPage, page }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetsByAccountNameQuery>) => {
                    return result.data as DatasetsByAccountNameQuery;
                }),
            );
    }

    public fetchDatasetsTotalCountByAccountName(accountName: string): Observable<DatasetsTotalCountByAccountNameQuery> {
        return this.datasetsTotalCountByAccountNameGQL
            .watch({ variables: { accountName }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetsTotalCountByAccountNameQuery>) => {
                    return result.data as DatasetsTotalCountByAccountNameQuery;
                }),
            );
    }

    public getBlockByHash(params: {
        accountName: string;
        datasetName: string;
        blockHash: string;
    }): Observable<GetMetadataBlockQuery> {
        return this.metadataBlockGQL
            .watch({
                variables: {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                    blockHash: params.blockHash,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<GetMetadataBlockQuery>) => {
                    return result.data as GetMetadataBlockQuery;
                }),
            );
    }

    public getDatasetInfoById(datasetId: string): Observable<DatasetByIdQuery> {
        return this.datasetByIdGQL
            .watch({
                variables: {
                    datasetId,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetByIdQuery>) => {
                    return result.data as DatasetByIdQuery;
                }),
            );
    }

    public getSystemTimeBlockByHash(
        datasetId: string,
        blockHash: string,
    ): Observable<DatasetSystemTimeBlockByHashQuery> {
        return this.datasetSystemTimeBlockByHashGQL
            .watch({
                variables: {
                    datasetId,
                    blockHash,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetSystemTimeBlockByHashQuery>) => {
                    return result.data as DatasetSystemTimeBlockByHashQuery;
                }),
            );
    }

    public getDatasetInfoByAccountAndDatasetName(
        accountName: string,
        datasetName: string,
    ): Observable<DatasetByAccountAndDatasetNameQuery> {
        return this.datasetByAccountAndDatasetNameGQL
            .watch({
                variables: {
                    accountName,
                    datasetName,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetByAccountAndDatasetNameQuery>) => {
                    return result.data as DatasetByAccountAndDatasetNameQuery;
                }),
            );
    }

    public createDatasetFromSnapshot(params: {
        snapshot: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<CreateDatasetFromSnapshotMutation> {
        return this.createDatasetFromSnapshotGQL.mutate({ variables: { ...params } }).pipe(
            first(),
            map((result: ApolloLink.Result<CreateDatasetFromSnapshotMutation>) => {
                return result.data as CreateDatasetFromSnapshotMutation;
            }),
        );
    }

    public createEmptyDataset(params: {
        datasetKind: DatasetKind;
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<CreateEmptyDatasetMutation> {
        return this.createEmptyDatasetGQL
            .mutate({
                variables: {
                    ...params,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<CreateEmptyDatasetMutation>) => {
                    return result.data as CreateEmptyDatasetMutation;
                }),
            );
    }

    public commitEvent(params: {
        accountId: string;
        datasetId: string;
        event: string;
    }): Observable<CommitEventToDatasetMutation> {
        return this.commitEventToDatasetGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    event: params.event,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<CommitEventToDatasetMutation>) => {
                    return result.data as CommitEventToDatasetMutation;
                }),
            );
    }

    public updateReadme(params: {
        accountId: string;
        datasetId: string;
        content: string;
    }): Observable<UpdateReadmeMutation> {
        return this.updateReadmeGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    content: params.content,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<UpdateReadmeMutation>) => {
                    return result.data as UpdateReadmeMutation;
                }),
            );
    }

    public deleteDataset(params: { accountId: string; datasetId: string }): Observable<DeleteDatasetMutation> {
        return this.deleteDatasetGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                },
                update: (cache) => {
                    // Drop entire dataset object
                    resetCacheHelper(cache, params);
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<DeleteDatasetMutation>) => {
                    return result.data as DeleteDatasetMutation;
                }),
            );
    }

    public renameDataset(params: {
        datasetId: string;
        newName: string;
        accountId: string;
    }): Observable<RenameDatasetMutation> {
        return this.renameDatasetGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    newName: params.newName,
                },
                update: (cache) => {
                    updateCacheHelper(cache, {
                        accountId: params.accountId,
                        datasetId: params.datasetId,
                        fieldNames: ["alias", "name"],
                    });
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<RenameDatasetMutation>) => {
                    return result.data as RenameDatasetMutation;
                }),
            );
    }

    public setWatermark(params: {
        datasetId: string;
        watermark: string;
        accountId: string;
    }): Observable<UpdateWatermarkMutation> {
        return this.updateWatermarkGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    watermark: params.watermark,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<UpdateWatermarkMutation>) => {
                    return result.data as UpdateWatermarkMutation;
                }),
            );
    }

    public setVisibilityDataset(params: {
        accountId: string;
        datasetId: string;
        visibility: DatasetVisibilityInput;
    }): Observable<SetVisibilityDatasetMutation> {
        return this.setVisibilityDatasetGQL
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    visibility: params.visibility,
                },
                update: (cache) => {
                    updateCacheHelper(cache, {
                        accountId: params.accountId,
                        datasetId: params.datasetId,
                        fieldNames: ["visibility"],
                    });
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<SetVisibilityDatasetMutation>) => {
                    return result.data as SetVisibilityDatasetMutation;
                }),
            );
    }

    public datasetHeadBlockHash(accountName: string, datasetName: string): Observable<DatasetHeadBlockHashQuery> {
        return this.datasetHeadBlockHashGQL
            .watch({
                variables: { accountName, datasetName },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetHeadBlockHashQuery>) => {
                    return result.data as DatasetHeadBlockHashQuery;
                }),
            );
    }

    public datasetPushSyncStatuses(datasetId: string): Observable<DatasetPushSyncStatusesQuery> {
        return this.datasetPushSyncStatusesGQL
            .watch({
                variables: { datasetId },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetPushSyncStatusesQuery>) => {
                    return result.data as DatasetPushSyncStatusesQuery;
                }),
            );
    }

    public datasetListDownstreams(datasetId: string): Observable<DatasetListDownstreamsQuery> {
        return this.datasetListDownstreamsGQL
            .watch({
                variables: { datasetId },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetListDownstreamsQuery>) => {
                    return result.data as DatasetListDownstreamsQuery;
                }),
            );
    }

    public getDatasetAsVersionedFile(datasetId: string): Observable<DatasetAsVersionedFileQuery> {
        return this.datasetAsVersionedFileGQL
            .watch({
                variables: {
                    datasetId,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetAsVersionedFileQuery>) => {
                    return result.data as DatasetAsVersionedFileQuery;
                }),
            );
    }

    public getDatasetAsVersionedFileByVersion(
        datasetId: string,
        version: number,
    ): Observable<DatasetAsVersionedFileByVersionQuery> {
        return this.datasetAsVersionedFileByVersionGQL
            .watch({
                variables: {
                    datasetId,
                    version,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetAsVersionedFileByVersionQuery>) => {
                    return result.data as DatasetAsVersionedFileByVersionQuery;
                }),
            );
    }

    // TODO: implement later with URL and write unit test
    public getDatasetAsVersionedFileByBlockHash(
        datasetId: string,
        blockHash: string,
    ): Observable<DatasetAsVersionedFileByBlockHashQuery> {
        return this.datasetAsVersionedFileByBlockHashGQL
            .watch({
                variables: {
                    datasetId,
                    blockHash,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetAsVersionedFileByBlockHashQuery>) => {
                    return result.data as DatasetAsVersionedFileByBlockHashQuery;
                }),
            );
    }

    public getVersionedFileContentUrl(datasetId: string, version: number): Observable<VersionedFileContentUrlQuery> {
        return this.versionedFileContentUrlGQL
            .watch({
                variables: {
                    datasetId,
                    version,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<VersionedFileContentUrlQuery>) => {
                    return result.data as VersionedFileContentUrlQuery;
                }),
            );
    }

    public getDatasetAsCollection(params: {
        datasetId: string;
        pathPrefix: string;
        maxDepth: number;
        page: number;
        perPage: number;
    }): Observable<DatasetAsCollectionQuery> {
        return this.datasetAsCollectionGQL
            .watch({
                variables: {
                    ...params,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetAsCollectionQuery>) => {
                    return result.data as DatasetAsCollectionQuery;
                }),
            );
    }

    public static generateDatasetKeyFragment(ownerRef: string | undefined, datasetId: string): StoreObject {
        return {
            __typename: "Dataset",
            owner: {
                __ref: ownerRef,
            },
            id: datasetId,
        };
    }

    public static generateAccountKeyFragment(accountId: string): StoreObject {
        return {
            __typename: "Account",
            id: accountId,
        };
    }
}
