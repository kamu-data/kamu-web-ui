import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { QueryExplainerResponse, VerifyQueryResponse } from "./query-explainer.types";
import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { DatasetByIdQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-query-explainer",
    templateUrl: "./query-explainer.component.html",
    styleUrls: ["./query-explainer.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryExplainerComponent extends BaseComponent implements OnInit {
    private clipboard = inject(Clipboard);
    private queryExplainerService = inject(QueryExplainerService);
    private cdr = inject(ChangeDetectorRef);
    private datasetService = inject(DatasetService);

    private sqlQuery: MaybeNull<string>;
    public sqlQueryExplainer: QueryExplainerResponse;
    public sqlQueryVerify$: Observable<VerifyQueryResponse>;
    public verifyResponse: VerifyQueryResponse;

    ngOnInit(): void {
        this.sqlQuery = this.extractSqlQueryFromRoute();
        if (this.sqlQuery) {
            this.queryExplainerService
                .proccessQuery(this.sqlQuery)
                .pipe(
                    tap((response) => (this.sqlQueryExplainer = response)),
                    switchMap((response: QueryExplainerResponse) => {
                        return this.queryExplainerService.verifyQuery(response);
                    }),
                    catchError((e: HttpErrorResponse) => {
                        return of(e.error as VerifyQueryResponse);
                    }),
                    tap((data) => {
                        this.verifyResponse = data;
                        this.cdr.detectChanges();
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        }
    }

    public getDatasetInfo$(datasetId: string): Observable<DatasetInfo> {
        return this.datasetService.requestDatasetInfoById(datasetId).pipe(
            map((data: DatasetByIdQuery) => {
                return {
                    accountName: data.datasets.byId?.owner.accountName ?? "",
                    datasetName: data.datasets.byId?.name ?? "",
                };
            }),
        );
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, AppValues.LONG_DELAY_MS);
            currentElementChildren[0].style.display = "none";
            currentElementChildren[1].style.display = "inline-block";
            currentElement.classList.add("clipboard-btn--success");
        }
    }

    private extractSqlQueryFromRoute(): MaybeNull<string> {
        const sqlQueryFromRoute: MaybeUndefined<string> = this.activatedRoute.snapshot.queryParams[
            ProjectLinks.URL_QUERY_PARAM_SQL_QUERY
        ] as MaybeUndefined<string>;

        return sqlQueryFromRoute ?? "";
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }

    private columnNames(): string[] {
        return this.sqlQueryExplainer?.output?.schema.fields.map((item) => item.name) as string[];
    }

    public get tableSource(): DataRow[] {
        const result = this.sqlQueryExplainer?.output?.data.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Object.assign({}, ...item.map((key, index) => ({ [this.columnNames()[index]]: key })));
        }) as DataRow[];
        return result;
    }
}
