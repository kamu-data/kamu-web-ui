/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, filter, finalize, map, Observable, switchMap } from "rxjs";

import { DatasetApi } from "@api/dataset.api";
import { CollectionEntryConnection, DatasetAsCollectionQuery } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

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

    public cacheEntries: Map<string, CollectionEntryViewType[]> = new Map();

    private loadingCollection$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public emitLoadingCollectionChanged(value: boolean): void {
        this.loadingCollection$.next(value);
    }

    public get loadingCollectionChanges(): Observable<boolean> {
        return this.loadingCollection$.asObservable();
    }

    private loadingOnScroll$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public emitLoadingOnScrollChanged(value: boolean): void {
        this.loadingOnScroll$.next(value);
    }

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

    private requestDatasetAsCollection(params: {
        datasetId: string;
        pathPrefix: string;
        maxDepth?: number;
        page: number;
        perPage: number;
    }): Observable<CollectionEntryConnection> {
        return this.datasetApi.getDatasetAsCollection(params).pipe(
            map((result: DatasetAsCollectionQuery) => {
                return result.datasets.byId?.asCollection?.latest.entries as CollectionEntryConnection;
            }),
        );
    }

    public loadCollectionInfo(datasetId: string, perPage: number): Observable<CollectionEntriesResult> {
        return this.loadCollectionData$.pipe(
            filter((params) => params !== null),
            switchMap((params) =>
                this.requestDatasetAsCollection({
                    datasetId,
                    pathPrefix: params.path,
                    page: params.page - 1,
                    perPage,
                }).pipe(
                    map((data) => ({
                        connection: data,
                        headChanged: params.headChanged,
                    })),
                    finalize(() => {
                        this.emitLoadingCollectionChanged(false);
                        this.emitLoadingOnScrollChanged(false);
                    }),
                ),
            ),
        );
    }
}
