/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, EMPTY, filter, map, Observable, switchMap } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { trackBusy } from "@common/helpers/app.helpers";
import { DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import {
    AccountFragment,
    CollectionAddEntryMutation,
    CollectionEntryConnectionDataFragment,
    CollectionRemoveEntryMutation,
    CreateDatasetAsVersionedFileMutation,
    DatasetAsCollectionQuery,
    DatasetBasicsFragment,
    DatasetVisibility,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetCreateService } from "src/app/dataset-create/dataset-create.service";

import {
    CollectionEntriesResult,
    CollectionEntryViewType,
    LoadCollectionDataParams,
} from "../components/collection-view/collection-view.model";

@Injectable({
    providedIn: "root",
})
export class DatasetAsCollectionService {
    private datasetApi = inject(DatasetApi);
    private toastrService = inject(ToastrService);

    public cacheEntries: Map<string, CollectionEntryViewType[]> = new Map();

    private loadingCollection$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public get loadingCollectionChanges(): Observable<boolean> {
        return this.loadingCollection$.asObservable();
    }

    private loadingOnScroll$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public get loadingOnScrollChanges(): Observable<boolean> {
        return this.loadingOnScroll$.asObservable();
    }

    private loadCollectionDataSubject$ = new BehaviorSubject<MaybeNull<LoadCollectionDataParams>>(null);

    public loadCollectionDataChange(data: MaybeNull<LoadCollectionDataParams>): void {
        return this.loadCollectionDataSubject$.next(data);
    }

    public get loadCollectionData$(): Observable<MaybeNull<LoadCollectionDataParams>> {
        return this.loadCollectionDataSubject$.asObservable();
    }

    public createVersionedFileInCollection(params: {
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<DatasetBasicsFragment> {
        return this.datasetApi.createDatasetAsVersionedFile(params).pipe(
            map((data: CreateDatasetAsVersionedFileMutation) => {
                if (data.datasets.createVersionedFile.__typename === "CreateDatasetResultSuccess") {
                    const dataset = data.datasets.createVersionedFile.dataset;
                    return dataset;
                } else {
                    this.toastrService.error(data.datasets.createVersionedFile.message);
                    return null;
                }
            }),
            filter((dataset): dataset is DatasetBasicsFragment => dataset !== null),
        );
    }

    public removeEntry(params: { datasetId: string; path: string }): Observable<void> {
        return this.datasetApi.collectionRemoveEntry(params).pipe(
            map((result: CollectionRemoveEntryMutation) => {
                const typename = result.datasets.byId?.asCollection?.removeEntry.__typename;
                const message = result.datasets.byId?.asCollection?.removeEntry.message;
                if (typename !== "CollectionUpdateSuccess") {
                    this.toastrService.error(message);
                }
            }),
        );
    }

    public addEntry(params: { datasetId: string; path: string; ref: string }): Observable<void> {
        return this.datasetApi.collectionAddEntry(params).pipe(
            map((result: CollectionAddEntryMutation) => {
                const typename = result.datasets.byId?.asCollection?.addEntry.__typename;
                const message = result.datasets.byId?.asCollection?.addEntry.message;
                if (typename !== "CollectionUpdateSuccess") {
                    this.toastrService.error(message);
                }
            }),
        );
    }

    private requestDatasetAsCollection(params: {
        datasetId: string;
        pathPrefix: string;
        maxDepth?: number;
        page: number;
        perPage: number;
    }): Observable<CollectionEntryConnectionDataFragment> {
        return this.datasetApi.getDatasetAsCollection(params).pipe(
            map((result: DatasetAsCollectionQuery) => {
                return result.datasets.byId?.asCollection?.latest.entries as CollectionEntryConnectionDataFragment;
            }),
        );
    }

    public loadCollectionInfo(datasetId: string, perPage: number): Observable<CollectionEntriesResult> {
        return this.loadCollectionData$.pipe(
            filter((params) => params !== null),
            switchMap((params) => {
                const activeBusySubject = params.scrollActivated ? this.loadingOnScroll$ : this.loadingCollection$;
                return this.requestDatasetAsCollection({
                    datasetId,
                    pathPrefix: params.path,
                    page: params.page - 1,
                    perPage,
                }).pipe(
                    trackBusy(activeBusySubject),
                    map((data) => ({
                        connection: data,
                        headChanged: params.headChanged,
                    })),
                );
            }),
        );
    }
}
