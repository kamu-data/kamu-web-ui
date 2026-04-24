/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, catchError, EMPTY, finalize, map, Observable, of, ReplaySubject, Subject } from "rxjs";
import { switchMap, take } from "rxjs/operators";

import saveAs from "file-saver";
import { ToastrService } from "ngx-toastr";

import { DatasetApi } from "@api/dataset.api";
import {
    DatasetAsVersionedFileByBlockHashQuery,
    DatasetAsVersionedFileByVersionQuery,
    DatasetAsVersionedFileQuery,
    VersionedFileContentUrlQuery,
    VersionedFileEntryDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { extractAndAddExtension } from "../components/versioned-file-view/versioned-file-view.model";

@Injectable({
    providedIn: "root",
})
export class DatasetAsVersionedFileService {
    private datasetApi = inject(DatasetApi);
    private http = inject(HttpClient);
    private toastrService = inject(ToastrService);

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

    public requestFileAsJson(url: string): Observable<object | undefined> {
        return this.http.get(url).pipe(
            catchError(() => {
                this.toastrService.error(`Error loading file`);
                return EMPTY;
            }),
        );
    }

    public requestFileAsText(url: string): Observable<string | undefined> {
        return this.http.get(url, { responseType: "text" }).pipe(
            catchError(() => {
                this.toastrService.error(`Error loading file`);
                return EMPTY;
            }),
        );
    }

    public downloadFile(datasetId: string, fileDetails: VersionedFileView): void {
        const info = fileDetails.fileInfo;
        if (!info?.contentUrl?.url) {
            this.toastrService.error(`Missing URL for file: ${fileDetails.name}, version: ${info?.version}`);
            return;
        }

        const url$ = this.isUrlExpired(info.contentUrl.expiresAt)
            ? this.getVersionedFileContentUrl(datasetId, info.version)
            : of(info.contentUrl.url);

        url$.pipe(
            switchMap((url) => this.http.get(url, { responseType: "blob" })),
            take(1),
        ).subscribe({
            next: (blob: Blob) => {
                const fileName = extractAndAddExtension(fileDetails.name);
                saveAs(blob, fileName);
            },
            error: () => {
                this.toastrService.error("Failed to download file");
            },
        });
    }

    public getVersionedFileContentUrl(datasetId: string, version: number): Observable<string> {
        return this.datasetApi.getVersionedFileContentUrl(datasetId, version).pipe(
            map((data: VersionedFileContentUrlQuery) => {
                return data.datasets.byId?.asVersionedFile?.asOf?.contentUrl.url as string;
            }),
        );
    }

    public isUrlExpired(expiredAt: MaybeNullOrUndefined<string>): boolean {
        if (!expiredAt) return true;
        return new Date() >= new Date(expiredAt);
    }
}
