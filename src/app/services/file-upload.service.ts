/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { catchError, finalize, first, Observable, of, Subject, switchMap, tap } from "rxjs";

import { AppConfigService } from "src/app/app-config.service";
import { MaybeUndefined } from "src/app/interface/app.types";
import {
    UploadAvailableMethod,
    UploadPrepareData,
    UploadPrepareResponse,
} from "src/app/interface/ingest-via-file-upload.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";

import { DatasetBasicsFragment, DatasetEndpoints } from "../api/kamu.graphql.interface";
import { UnsubscribeDestroyRefAdapter } from "../common/components/unsubscribe.ondestroy.adapter";
import { FileUploadError } from "../common/values/errors";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { LocalStorageService } from "./local-storage.service";
import { NavigationService } from "./navigation.service";
import { ProtocolsService } from "./protocols.service";

@Injectable({
    providedIn: "root",
})
export class FileUploadService extends UnsubscribeDestroyRefAdapter {
    private http = inject(HttpClient);
    private localStorageService = inject(LocalStorageService);
    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);
    private protocolsService = inject(ProtocolsService);

    private uploadFileLoading$ = new Subject<boolean>();

    public get isUploadFile(): Observable<boolean> {
        return this.uploadFileLoading$.asObservable();
    }

    public uploadFile(file: File, datasetBasics: DatasetBasicsFragment): Observable<object> {
        const uploadPrepare$: Observable<UploadPrepareResponse> = this.uploadFilePrepare(file);
        let uploadToken = "";
        return uploadPrepare$.pipe(
            tap((data) => (uploadToken = data.uploadToken)),
            tap(() => this.uploadFileLoading$.next(true)),
            switchMap((uploadPrepareResponse: UploadPrepareResponse) =>
                this.prepareUploadData(uploadPrepareResponse, file),
            ),
            switchMap(({ uploadPrepareResponse, bodyObject, uploadHeaders }: UploadPrepareData) =>
                this.uploadFileByMethod(
                    uploadPrepareResponse.method,
                    uploadPrepareResponse.uploadUrl,
                    bodyObject,
                    uploadHeaders,
                ),
            ),
            switchMap(() => {
                return this.ingestDataToDataset(
                    {
                        accountName: datasetBasics.owner.accountName,
                        datasetName: datasetBasics.name,
                    },
                    uploadToken,
                );
            }),
            catchError((e: HttpErrorResponse) => {
                //status 415 - Unsupported media type
                if (e.status === 415) {
                    throw new FileUploadError([
                        new Error(
                            "File could not be loaded. Supported file types: CSV, JSON, Newline-delimited JSON, Geo JSON, Newline-delimited Geo JSON, ESRI Shapefile, Parquet",
                        ),
                    ]);
                } else {
                    throw new FileUploadError([new Error("File could not be loaded")]);
                }
            }),
            first(),
            finalize(() => {
                this.uploadFileLoading$.next(false);
                this.updatePage(datasetBasics);
            }),
        );
    }

    private updatePage(datasetBasics: DatasetBasicsFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: datasetBasics.owner.accountName,
            datasetName: datasetBasics.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    public uploadFilePrepare(file: File): Observable<UploadPrepareResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/platform/file/upload/prepare`);
        url.searchParams.append("fileName", file.name);
        url.searchParams.append("contentLength", file.size.toString());
        url.searchParams.append("contentType", file.type);
        return this.http
            .post<UploadPrepareResponse>(url.href, null, {
                headers: { Authorization: `Bearer ${this.localStorageService.accessToken}` },
            })
            .pipe(
                catchError((e: HttpErrorResponse) => {
                    throw new FileUploadError([new Error(`File could not be prepare for upload, ${e.error}`)]);
                }),
            );
    }

    public uploadPostFile(url: string, bodyObject: File | FormData, uploadHeaders: HttpHeaders): Observable<object> {
        return this.http
            .post(url, bodyObject, {
                headers: uploadHeaders,
            })
            .pipe(
                catchError((e: HttpErrorResponse) => {
                    throw new FileUploadError([new Error(`File could not be loaded with POST, ${e.error}`)]);
                }),
            );
    }

    public uploadPutFile(url: string, bodyObject: File | FormData, uploadHeaders: HttpHeaders): Observable<object> {
        return this.http
            .put(url, bodyObject, {
                headers: uploadHeaders,
            })
            .pipe(
                catchError((e: HttpErrorResponse) => {
                    throw new FileUploadError([new Error(`File could not be loaded with PUT, ${e.error}`)]);
                }),
            );
    }

    public ingestDataToDataset(datasetInfo: DatasetInfo, uploadToken: string): Observable<object> {
        return this.protocolsService.getProtocols(datasetInfo).pipe(
            switchMap((protocols: MaybeUndefined<DatasetEndpoints>) =>
                this.http.post<object>(`${protocols?.rest.pushUrl}?uploadToken=${uploadToken}`, null, {
                    headers: { Authorization: `Bearer ${this.localStorageService.accessToken}` },
                }),
            ),
        );
    }

    public prepareUploadData(uploadPrepareResponse: UploadPrepareResponse, file: File): Observable<UploadPrepareData> {
        let uploadHeaders = new HttpHeaders();
        uploadPrepareResponse.headers.forEach((header: [string, string]) => {
            uploadHeaders = uploadHeaders.append(header[0], header[1]);
        });
        let bodyObject: FormData | File;
        if (uploadPrepareResponse.useMultipart) {
            const formData = new FormData();
            uploadPrepareResponse.fields.forEach((field: [string, string]) => {
                formData.append(field[0], field[1]);
            });
            formData.append("file", file);
            bodyObject = formData;
        } else {
            bodyObject = file;
        }
        return of({
            uploadPrepareResponse,
            bodyObject,
            uploadHeaders,
        });
    }

    public uploadFileByMethod(
        method: UploadAvailableMethod,
        uploadUrl: string,
        bodyObject: File | FormData,
        uploadHeaders: HttpHeaders,
    ): Observable<object> {
        switch (method) {
            case "POST":
                return this.uploadPostFile(uploadUrl, bodyObject, uploadHeaders);
            case "PUT":
                return this.uploadPutFile(uploadUrl, bodyObject, uploadHeaders);
            /* istanbul ignore next */
            default:
                throw new Error("Unexpected upload method");
        }
    }
}
