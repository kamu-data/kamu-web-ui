/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, finalize, map, Observable, ReplaySubject, Subject } from "rxjs";

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

    private versionedFileDetails$: Subject<VersionedFileView> = new ReplaySubject(1 /*bufferSize*/);

    public emitVersionedFileDetailsChanged(info: VersionedFileView): void {
        this.versionedFileDetails$.next(info);
    }

    public get versionedFileDetailsChanges(): Observable<VersionedFileView> {
        return this.versionedFileDetails$.asObservable();
    }

    private loadingFileDetails$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public emitLoadingFileDetailsChanged(value: boolean): void {
        this.loadingFileDetails$.next(value);
    }

    public get loadingFileDetailsChanges(): Observable<boolean> {
        return this.loadingFileDetails$.asObservable();
    }

    private selectFileVersion$: Subject<number> = new Subject();

    public emitSelectFileVersionChanged(value: number): void {
        this.selectFileVersion$.next(value);
    }

    public get selectFileVersionChanges(): Observable<number> {
        return this.selectFileVersion$.asObservable();
    }

    public requestDatasetAsVersionedFile(datasetId: string): Observable<VersionedFileView> {
        this.emitLoadingFileDetailsChanged(true);
        return this.datasetApi.getDatasetAsVersionedFile(datasetId).pipe(
            map((result: DatasetAsVersionedFileQuery) => {
                const data = {
                    name: result.datasets.byId?.name as string,
                    fileInfo: result.datasets.byId?.asVersionedFile?.latest as VersionedFileEntryDataFragment,
                    countVersions: result.datasets.byId?.asVersionedFile?.versions.totalCount as number,
                };
                this.emitVersionedFileDetailsChanged(data);
                return data;
            }),
            finalize(() => {
                this.emitLoadingFileDetailsChanged(false);
            }),
        );
    }

    public requestDatasetAsVersionedFileByVersion(datasetId: string, version: number): Observable<VersionedFileView> {
        this.emitLoadingFileDetailsChanged(true);
        return this.datasetApi.getDatasetAsVersionedFileByVersion(datasetId, version).pipe(
            map((result: DatasetAsVersionedFileByVersionQuery) => {
                const data = {
                    name: result.datasets.byId?.name as string,
                    fileInfo: result.datasets.byId?.asVersionedFile?.asOf as VersionedFileEntryDataFragment,
                    countVersions: result.datasets.byId?.asVersionedFile?.versions.totalCount as number,
                };
                this.emitVersionedFileDetailsChanged(data);
                return data;
            }),
            finalize(() => {
                this.emitLoadingFileDetailsChanged(false);
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
                    fileInfo: result.datasets.byId?.asVersionedFile?.asOf as VersionedFileEntryDataFragment,
                };
            }),
        );
    }
}
