import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable, shareReplay } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { QueryExplainerInputType, QueryExplainerResponse, VerifyQueryResponse } from "./query-explainer.types";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Injectable({
    providedIn: "root",
})
export class QueryExplainerService {
    private appConfigService = inject(AppConfigService);
    private http = inject(HttpClient);
    private toastrService = inject(ToastrService);
    private localStorageService = inject(LocalStorageService);

    public processQuery(query: string): Observable<QueryExplainerResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/query`);
        const body: QueryExplainerInputType = {
            query: query,
            dataFormat: "JsonAoa",
            schemaFormat: "ArrowJson",
            include: ["Proof"],
        };
        return this.http.post<QueryExplainerResponse>(url.href, body).pipe(
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", e.error as string, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public verifyQuery(data: QueryExplainerResponse): Observable<VerifyQueryResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/verify`);
        return this.http.post<VerifyQueryResponse>(url.href, data);
    }

    public fetchCommitmentDataByUploadToken(token: string): Observable<QueryExplainerResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/platform/file/upload/${token}`);
        return this.http.get<QueryExplainerResponse>(url.href, {
            headers: { Authorization: `Bearer ${this.localStorageService.accessToken}` },
        });
    }
}
