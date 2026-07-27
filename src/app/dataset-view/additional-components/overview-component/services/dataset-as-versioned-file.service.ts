/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, catchError, EMPTY, finalize, map, Observable, of, ReplaySubject, Subject } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";

import saveAs from "file-saver";
import { ToastrService } from "ngx-toastr";

import { DatasetApi } from "@api/dataset.api";
import {
    DatasetAsVersionedFileByBlockHashQuery,
    DatasetAsVersionedFileByVersionQuery,
    DatasetAsVersionedFileQuery,
    DatasetBasicsFragment,
    FinishUploadNewVersionMutation,
    StartUploadNewVersionMutation,
    VersionedFileContentUrlQuery,
    VersionedFileEntryDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "@interface/app.types";
import {
    UploadAvailableMethod,
    UploadPrepareData,
    UploadPrepareResponse,
} from "@interface/ingest-via-file-upload.types";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { FileUploadService } from "src/app/services/file-upload.service";
import { NavigationService } from "src/app/services/navigation.service";

import { extractAndAddExtension } from "../components/versioned-file-view/versioned-file-view.model";

@Injectable({
    providedIn: "root",
})
export class DatasetAsVersionedFileService {
    private datasetApi = inject(DatasetApi);
    private http = inject(HttpClient);
    private toastrService = inject(ToastrService);
    private fileUploadService = inject(FileUploadService);
    private navigationService = inject(NavigationService);

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
            take(1),
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
            take(1),
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

    public uploadFilePrepare(params: {
        datasetId: string;
        contentLength: number;
        contentType: string;
    }): Observable<UploadPrepareResponse> {
        return this.datasetApi.startUploadVersionedFile(params).pipe(
            take(1),
            switchMap((response: StartUploadNewVersionMutation) => {
                const result = response.datasets.byId?.asVersionedFile?.startUploadNewVersion;

                if (!result || result.__typename !== "StartUploadVersionSuccess") {
                    this.toastrService.error(result?.message ?? "Failed to prepare file upload");
                    return EMPTY;
                }

                const uploadPrepareResponse: UploadPrepareResponse = {
                    uploadToken: result.uploadToken,
                    uploadUrl: result.url,
                    method: result.method as UploadAvailableMethod,
                    useMultipart: result.useMultipart,
                    headers: result.headers.map(({ key, value }): [string, string] => [key, value]),
                    fields: [],
                };

                return of(uploadPrepareResponse);
            }),
        );
    }

    public finishUploadFile(params: { datasetId: string; uploadToken: string }): Observable<number> {
        return this.datasetApi.finishUploadVersionedFile(params).pipe(
            take(1),
            switchMap((response: FinishUploadNewVersionMutation) => {
                const result = response.datasets.byId?.asVersionedFile?.finishUploadNewVersion;

                if (!result || result.__typename !== "UpdateVersionSuccess") {
                    this.toastrService.error(result?.message ?? "Failed to finish file upload");
                    return EMPTY;
                }

                return of(result.newVersion);
            }),
        );
    }

    public uploadVersionedFile(file: File, datasetBasics: DatasetBasicsFragment): Observable<number> {
        const uploadPrepare$: Observable<UploadPrepareResponse> = this.uploadFilePrepare({
            datasetId: datasetBasics.id,
            contentLength: file.size,
            contentType: file.type,
        });
        let uploadToken = "";
        return uploadPrepare$.pipe(
            tap((data) => {
                uploadToken = data.uploadToken;
            }),

            switchMap((uploadPrepareResponse: UploadPrepareResponse) =>
                this.fileUploadService.prepareUploadData(uploadPrepareResponse, file),
            ),
            switchMap(({ uploadPrepareResponse, bodyObject, uploadHeaders }: UploadPrepareData) =>
                this.fileUploadService.uploadFileByMethod(
                    uploadPrepareResponse.method,
                    uploadPrepareResponse.uploadUrl,
                    bodyObject,
                    uploadHeaders,
                ),
            ),
            switchMap(() => {
                return this.finishUploadFile({ datasetId: datasetBasics.id, uploadToken });
            }),
            tap((newVersion: number) => {
                this.updatePage(datasetBasics, newVersion);
            }),
        );
    }

    public updatePage(datasetBasics: DatasetBasicsFragment, version: number): void {
        this.navigationService.navigateToDatasetView({
            accountName: datasetBasics.owner.accountName,
            datasetName: datasetBasics.name,
            tab: DatasetViewTypeEnum.Overview,
            version: version.toString(),
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
