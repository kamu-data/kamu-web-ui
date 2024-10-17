import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { catchError, forkJoin, Observable, of, switchMap, tap } from "rxjs";
import { QueryExplainerResponse, VerifyQueryResponse } from "./query-explainer.types";
import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";

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
    private blockService = inject(BlockService);

    private sqlQuery: MaybeNull<string>;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    public sqlQueryExplainer: QueryExplainerResponse;
    public sqlQueryVerify$: Observable<VerifyQueryResponse>;
    public verifyResponse: VerifyQueryResponse;
    public blockHashSystemTimes: string[] = [];

    ngOnInit(): void {
        this.sqlQuery = this.extractSqlQueryFromRoute();

        if (this.sqlQuery) {
            const blockHashObservables$: Observable<string>[] = [];
            this.queryExplainerService
                .proccessQuery(this.sqlQuery)
                .pipe(
                    tap((response) => {
                        this.sqlQueryExplainer = response;
                        response.input.datasets
                            .map((dataset) => ({ datasetId: dataset.id, blockHash: dataset.blockHash }))
                            .forEach(({ datasetId, blockHash }) => {
                                blockHashObservables$.push(
                                    this.blockService.requestSystemTimeBlockByHash(datasetId, blockHash),
                                );
                            });
                    }),
                    switchMap((response: QueryExplainerResponse) => {
                        return this.queryExplainerService.verifyQuery(response);
                    }),
                    catchError((e: HttpErrorResponse) => {
                        return of(e.error as VerifyQueryResponse);
                    }),
                    tap((data) => {
                        this.verifyResponse = data;
                    }),
                    switchMap(() => forkJoin(blockHashObservables$)),
                    tap((blockHashSystemTimes) => {
                        this.blockHashSystemTimes = blockHashSystemTimes;
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe(() => this.cdr.detectChanges());
        }
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

    public routeToDataset(alias: string): string {
        return alias.includes("/") ? alias : `kamu/${alias}`;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }

    public inputParamsHelper(option: string): string {
        switch (option) {
            case "SqlDataFusion":
                return "Sql Data Fusion";
            case "JsonAoA":
                return "Json AoA";
            case "ArrowJson":
                return "Arrow Json";
            default:
                return "Unknown options";
        }
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
