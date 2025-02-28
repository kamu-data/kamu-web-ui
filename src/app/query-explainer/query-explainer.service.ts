/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, map, Observable, of, tap } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import {
    QueryExplainerDataJsonAosResponse,
    QueryExplainerInputType,
    QueryExplainerProofResponse,
    QueryExplainerResponse,
    VerifyQueryResponse,
} from "./query-explainer.types";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class QueryExplainerService {
    private appConfigService = inject(AppConfigService);
    private http = inject(HttpClient);
    private toastrService = inject(ToastrService);
    private baseUrl: string;

    public constructor() {
        this.baseUrl = `${this.appConfigService.apiServerHttpUrl}`;
    }

    public processQueryWithProof(query: string): Observable<QueryExplainerProofResponse> {
        const url = new URL(`${this.baseUrl}/query`);
        const body: QueryExplainerInputType = {
            query,
            include: ["Proof"],
        };
        return this.http.post<QueryExplainerProofResponse>(url.href, body).pipe(
            map((response: QueryExplainerResponse) => {
                const cloneData = Object.assign({}, response);
                if ("output" in cloneData) {
                    delete cloneData.output;
                }
                return cloneData as QueryExplainerProofResponse;
            }),
            tap((res: QueryExplainerProofResponse) => {
                if (res.subQueries?.length) {
                    throw new Error("Unsupported subQueries array");
                }
            }),
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", (e.error as { message: string }).message, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
        );
    }

    public processQueryWithSchema(query: string): Observable<QueryExplainerDataJsonAosResponse> {
        const url = new URL(`${this.baseUrl}/query`);
        const body: QueryExplainerInputType = {
            query,
            include: ["Schema"],
        };
        return this.http.post<QueryExplainerDataJsonAosResponse>(url.href, body).pipe(
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", (e.error as { message: string }).message, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
        );
    }

    public verifyQuery(data: QueryExplainerResponse): Observable<VerifyQueryResponse> {
        const url = new URL(`${this.baseUrl}/verify`);
        return this.http.post<VerifyQueryResponse>(url.href, data).pipe(
            catchError((e: HttpErrorResponse) => {
                if (e.status === 400) return of(e.error as VerifyQueryResponse);
                else {
                    this.toastrService.error("", (e.error as { message: string }).message, {
                        disableTimeOut: "timeOut",
                    });
                    return EMPTY;
                }
            }),
        );
    }

    public fetchCommitmentDataByUploadToken(token: string): Observable<QueryExplainerResponse> {
        const url = new URL(`${this.baseUrl}/platform/file/upload/${token}`);
        return this.http.get<QueryExplainerResponse>(url.href).pipe(
            catchError((e: HttpErrorResponse) => {
                this.toastrService.error("", (e.error as { message: string }).message, {
                    disableTimeOut: "timeOut",
                });
                return EMPTY;
            }),
        );
    }
}
