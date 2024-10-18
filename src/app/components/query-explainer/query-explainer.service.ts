import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { QueryExplainerInputType, QueryExplainerResponse, VerifyQueryResponse } from "./query-explainer.types";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class QueryExplainerService {
    private appConfigService = inject(AppConfigService);
    private httpClient = inject(HttpClient);
    private toastrService = inject(ToastrService);

    public proccessQuery(query: string): Observable<QueryExplainerResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/query`);
        const body: QueryExplainerInputType = {
            query: query,
            dataFormat: "JsonAoa",
            schemaFormat: "ArrowJson",
            include: ["Proof"],
        };
        return this.httpClient.post<QueryExplainerResponse>(url.href, body).pipe(
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", e.error as string, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
        );
    }

    public verifyQuery(data: QueryExplainerResponse): Observable<VerifyQueryResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/verify`);
        const cloneData = Object.assign({}, data);
        if ("output" in cloneData) {
            delete cloneData.output;
        }
        return this.httpClient.post<VerifyQueryResponse>(url.href, cloneData);
    }
}
