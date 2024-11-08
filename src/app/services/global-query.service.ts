import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, EMPTY } from "rxjs";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { QueryExplainerInputOutputResponse, QueryExplainerInputType } from "../query-explainer/query-explainer.types";
import { ToastrService } from "ngx-toastr";
import { AppConfigService } from "../app-config.service";

@Injectable({
    providedIn: "root",
})
export class GlobalQueryService {
    private appConfigService = inject(AppConfigService);
    private http = inject(HttpClient);
    private toastrService = inject(ToastrService);
    private baseUrl: string;
    private readonly DEFAULT_ROWS_LIMIT = 50;

    constructor() {
        this.baseUrl = `${this.appConfigService.apiServerHttpUrl}`;
    }

    public processQueryWithInputAndSchema(params: DatasetRequestBySql): Observable<QueryExplainerInputOutputResponse> {
        const url = new URL(`${this.baseUrl}/query`);
        const body: QueryExplainerInputType = {
            query: params.query,
            include: ["Schema", "Input"],
            limit: params.limit ?? this.DEFAULT_ROWS_LIMIT,
            skip: params.skip ?? 0,
        };
        return this.http.post<QueryExplainerInputOutputResponse>(url.href, body).pipe(
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", e.error as string, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
        );
    }
}
