import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MaybeUndefined, UploadPrepareResponse } from "../common/app.types";
import { LocalStorageService } from "./local-storage.service";
import { DatasetInfo } from "../interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class FileUploadService {
    private authHeaders: MaybeUndefined<{
        [header: string]: string | string[];
    }>;
    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
    ) {
        this.authHeaders = { Authorization: `Bearer ${this.localStorageService.accessToken}` };
    }

    public uploadFilePrepare(file: File): Observable<UploadPrepareResponse> {
        return this.http.post<UploadPrepareResponse>(
            "http://localhost:8080/platform/file/upload/prepare?fileName=" +
                file.name +
                "&contentLength=" +
                file.size +
                "&contentType=" +
                file.type,
            null,
            { headers: this.authHeaders },
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
        return this.http.post<object>(
            `http://localhost:8080/${datasetInfo.datasetName}/ingest?uploadToken=${uploadToken}`,
            null,
            { headers: this.authHeaders },
        );
    }
}
