import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, EMPTY, Subject, ReplaySubject } from "rxjs";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { QueryExplainerInputOutputResponse, QueryExplainerInputType } from "../query-explainer/query-explainer.types";
import { AppConfigService } from "../app-config.service";
import { DataSqlErrorUpdate } from "../dataset-view/dataset.subscriptions.interface";

@Injectable({
    providedIn: "root",
})
export class GlobalQueryService {
    private appConfigService = inject(AppConfigService);
    private http = inject(HttpClient);
    private baseUrl: string;
    private readonly DEFAULT_ROWS_LIMIT = 50;

    private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);
    public emitSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
        this.sqlError$.next(dataSqlErrorUpdate);
    }

    public resetSqlError(): void {
        this.emitSqlErrorOccurred({ error: "" });
    }

    public get sqlErrorOccurrences(): Observable<DataSqlErrorUpdate> {
        return this.sqlError$.asObservable();
    }

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
                this.emitSqlErrorOccurred({ error: e.error as string });
                return EMPTY;
            }),
        );
    }
}
