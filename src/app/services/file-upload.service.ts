import { AppConfigService } from "src/app/app-config.service";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, Subject, catchError, finalize, first, of, switchMap, tap } from "rxjs";
import { MaybeUndefined } from "../common/app.types";
import { LocalStorageService } from "./local-storage.service";
import { DatasetInfo } from "../interface/navigation.interface";
import { DatasetBasicsFragment, DatasetEndpoints } from "../api/kamu.graphql.interface";
import { APOLLO_OPTIONS } from "apollo-angular";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { DatasetService } from "../dataset-view/dataset.service";
import { NavigationService } from "./navigation.service";
import { ProtocolsService } from "./protocols.service";
import { UploadPrepareResponse, UploadPerareData, UploadAvailableMethod } from "../common/ingest-via-file-upload.types";
import { updateCacheHelper } from "../apollo-cache.helper";
import { FileUploadError } from "../common/errors";

@Injectable({
    providedIn: "root",
})
export class FileUploadService {
    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private appConfigService: AppConfigService,
        private navigationService: NavigationService,
        private datasetService: DatasetService,
        private injector: Injector,
        private protocolsService: ProtocolsService,
    ) {}

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
            switchMap(({ uploadPrepareResponse, bodyObject, uploadHeaders }: UploadPerareData) =>
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
        this.updateCache(datasetBasics);
        this.datasetService
            .requestDatasetMainData({
                accountName: datasetBasics.owner.accountName,
                datasetName: datasetBasics.name,
            })
            .subscribe(),
            this.navigationService.navigateToDatasetView({
                accountName: datasetBasics.owner.accountName,
                datasetName: datasetBasics.name,
                tab: DatasetViewTypeEnum.Overview,
            });
    }

    private updateCache(datasetBasics: DatasetBasicsFragment): void {
        const cache = this.injector.get(APOLLO_OPTIONS).cache;
        if (cache) {
            updateCacheHelper(cache, {
                accountId: datasetBasics.owner.id,
                datasetId: datasetBasics.id,
                fieldNames: ["metadata"],
            });
        }
    }

    public uploadFilePrepare(file: File): Observable<UploadPrepareResponse> {
        return this.http.post<UploadPrepareResponse>(
            `${this.appConfigService.apiServerHttpUrl}/platform/file/upload/prepare?fileName=` +
                file.name +
                "&contentLength=" +
                file.size +
                "&contentType=" +
                file.type,
            null,
            { headers: { Authorization: `Bearer ${this.localStorageService.accessToken}` } },
        );
    }

    public uploadPostFile(url: string, bodyObject: File | FormData, uploadHeaders: HttpHeaders): Observable<object> {
        return this.http.post(url, bodyObject, {
            headers: uploadHeaders,
        });
    }

    public uploadPutFile(url: string, bodyObject: File | FormData, uploadHeaders: HttpHeaders): Observable<object> {
        return this.http.put(url, bodyObject, {
            headers: uploadHeaders,
        });
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

    private prepareUploadData(uploadPrepareResponse: UploadPrepareResponse, file: File): Observable<UploadPerareData> {
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

    private uploadFileByMethod(
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
