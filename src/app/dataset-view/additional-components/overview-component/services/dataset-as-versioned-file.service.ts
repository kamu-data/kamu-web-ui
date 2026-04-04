/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { DatasetApi } from "@api/dataset.api";
import {
    DatasetAsVersionedFileByBlockHashQuery,
    DatasetAsVersionedFileByVersionQuery,
    DatasetAsVersionedFileQuery,
    VersionedFileEntryDataFragment,
} from "@api/kamu.graphql.interface";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetAsVersionedFileService {
    private datasetApi = inject(DatasetApi);

    public requestDatasetAsVersionedFile(datasetId: string): Observable<VersionedFileView> {
        return this.datasetApi.getDatasetAsVersionedFile(datasetId).pipe(
            map((result: DatasetAsVersionedFileQuery) => {
                return {
                    name: result.datasets.byId?.name as string,
                    fileInfo: result.datasets.byId?.asVersionedFile as VersionedFileEntryDataFragment,
                };
            }),
        );
    }

    public requestDatasetAsVersionedFileByVersion(datasetId: string, version: number): Observable<VersionedFileView> {
        return this.datasetApi.getDatasetAsVersionedFileByVersion(datasetId, version).pipe(
            map((result: DatasetAsVersionedFileByVersionQuery) => {
                return {
                    name: result.datasets.byId?.name as string,
                    fileInfo: result.datasets.byId?.asVersionedFile as VersionedFileEntryDataFragment,
                };
            }),
        );
    }

    public requestDatasetAsVersionedFileByBlockHash(
        datasetId: string,
        blockHash: string,
    ): Observable<VersionedFileView> {
        return this.datasetApi.getDatasetAsVersionedFileByBlockHash(datasetId, blockHash).pipe(
            map((result: DatasetAsVersionedFileByBlockHashQuery) => {
                return {
                    name: result.datasets.byId?.name as string,
                    fileInfo: result.datasets.byId?.asVersionedFile as VersionedFileEntryDataFragment,
                };
            }),
        );
    }
}
