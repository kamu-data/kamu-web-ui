import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { QueryExplainerResponse, VerifyQueryResponse } from "./query-explainer.types";

@Injectable({
    providedIn: "root",
})
export class QueryExplainerService {
    private appConfigService = inject(AppConfigService);
    private httpClient = inject(HttpClient);

    public proccessQuery(query: string): Observable<QueryExplainerResponse> {
        const url = new URL(`${this.appConfigService.apiServerHttpUrl}/query`);
        const body = {
            query: query,
            queryDialect: "SqlDataFusion",
            limit: 20,
            dataFormat: "JsonAoa",
            schemaFormat: "ArrowJson",
            include: ["proof"],
        };
        return this.httpClient.post<QueryExplainerResponse>(url.href, body);
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
