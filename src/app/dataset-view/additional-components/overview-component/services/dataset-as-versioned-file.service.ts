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

import { requireValue } from "@common/helpers/app.helpers";
import { DatasetApi } from "@api/dataset.api";
import {
    DatasetAsVersionedFileByVersionQuery,
    DatasetAsVersionedFileQuery,
    VersionedFileContentUrlQuery,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { extractAndAddExtension } from "../components/versioned-file-view/versioned-file-view.model";
import { VersionedFileViewTexts } from "../components/versioned-file-view/versioned-file-view.text";

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

    private loadingFileDetails$: BehaviorSubject<boolean> = new BehaviorSubject(true);

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
            take(1),
            map((result: DatasetAsVersionedFileQuery) => {
                const dataset = requireValue(result.datasets.byId, "Dataset not found");
                const versionedFile = requireValue(dataset.asVersionedFile, "Dataset is not a versioned file");
                const data = {
                    name: dataset.name,
                    fileInfo: versionedFile.latest ?? null,
                    countVersions: versionedFile.versions.totalCount,
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
            take(1),
            map((result: DatasetAsVersionedFileByVersionQuery) => {
                const dataset = requireValue(result.datasets.byId, "Dataset not found");
                const versionedFile = requireValue(dataset.asVersionedFile, "Dataset is not a versioned file");
                const data = {
                    name: dataset.name,
                    fileInfo: versionedFile.asOf ?? null,
                    countVersions: versionedFile.versions.totalCount,
                };
                this.emitVersionedFileDetailsChanged(data);
                return data;
            }),
            finalize(() => {
                this.emitLoadingFileDetailsChanged(false);
            }),
        );
    }

    public requestFileAsJson(url: string): Observable<MaybeUndefined<object>> {
        return this.http.get(url).pipe(
            catchError(() => {
                this.toastrService.error(`Error loading file`);
                return EMPTY;
            }),
        );
    }

    public requestFileAsText(url: string): Observable<MaybeUndefined<string>> {
        return this.http.get(url, { responseType: "text" }).pipe(
            catchError(() => {
                this.toastrService.error(`Error loading file`);
                return EMPTY;
            }),
        );
    }

    public downloadFile(datasetId: string, fileDetails: VersionedFileView): void {
        const info = fileDetails.fileInfo;
        if (!info) return;

        this.getVersionedFileContentUrl(datasetId, info.version)
            .pipe(
                switchMap((url) => {
                    if (!url) {
                        this.toastrService.error(VersionedFileViewTexts.DOWNLOAD_UNAVAILABLE);
                        return EMPTY;
                    }
                    return this.http.get(url, { responseType: "blob" });
                }),
                take(1),
            )
            .subscribe({
                next: (blob: Blob) => {
                    const fileName = extractAndAddExtension(fileDetails.name);
                    saveAs(blob, fileName);
                },
                error: () => {
                    this.toastrService.error(VersionedFileViewTexts.DOWNLOAD_FAILED);
                },
            });
    }

    /**
     * A fresh download URL of the file content, or `null` when the node cannot serve the content
     * directly, as with local storage, or the URL could not be requested
     */
    public getVersionedFileContentUrl(datasetId: string, version: number): Observable<MaybeNull<string>> {
        return this.datasetApi.getVersionedFileContentUrl(datasetId, version).pipe(
            map((data: VersionedFileContentUrlQuery) => {
                const versionedFile = requireValue(
                    data.datasets.byId?.asVersionedFile,
                    "Dataset is not a versioned file",
                );
                return versionedFile.asOf?.contentUrl.url ?? null;
            }),
            catchError(() => of(null)),
        );
    }
}
