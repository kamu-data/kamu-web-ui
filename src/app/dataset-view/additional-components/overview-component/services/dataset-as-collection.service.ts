/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { DatasetApi } from "@api/dataset.api";
import { CollectionEntryConnection, DatasetAsCollectionQuery } from "@api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetAsCollectionService {
    private datasetApi = inject(DatasetApi);

    public requestDatasetAsCollection(params: {
        datasetId: string;
        pathPrefix: string;
        maxDepth: number;
        page: number;
        perPage: number;
    }): Observable<CollectionEntryConnection> {
        return this.datasetApi.getDatasetAsCollection(params).pipe(
            map((result: DatasetAsCollectionQuery) => {
                return result.datasets.byId?.asCollection?.latest.entries as CollectionEntryConnection;
            }),
        );
    }
}
