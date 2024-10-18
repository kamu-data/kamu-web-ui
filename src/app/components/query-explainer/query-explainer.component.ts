import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { catchError, forkJoin, Observable, of, switchMap, tap } from "rxjs";
import {
    QueryExplainerOutputType,
    QueryExplainerResponse,
    QueryExplainerSchemaType,
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "./query-explainer.types";
import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { changeCopyIcon } from "src/app/common/app.helpers";

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
    public readonly VerifyQueryKindError: typeof VerifyQueryKindError = VerifyQueryKindError;

    public sqlQueryExplainerResponse: QueryExplainerResponse;
    public sqlQueryVerify$: Observable<VerifyQueryResponse>;
    public verifyResponse: VerifyQueryResponse;
    public blockHashSystemTimes: Date[] = [];

    ngOnInit(): void {
        this.sqlQuery = this.extractSqlQueryFromRoute();

        if (this.sqlQuery) {
            const blockHashObservables$: Observable<Date>[] = [];
            this.queryExplainerService
                .proccessQuery(this.sqlQuery)
                .pipe(
                    tap((response) => {
                        this.sqlQueryExplainerResponse = response;
                        response.input.datasets
                            ?.map((dataset) => ({ datasetId: dataset.id, blockHash: dataset.blockHash }))
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
        changeCopyIcon(event);
    }

    private extractSqlQueryFromRoute(): string {
        const sqlQueryFromRoute: MaybeUndefined<string> = this.activatedRoute.snapshot.queryParams[
            ProjectLinks.URL_QUERY_PARAM_SQL_QUERY
        ] as MaybeUndefined<string>;
        return sqlQueryFromRoute ?? "";
    }

    public routeToDataset(alias: string): string {
        return alias.includes("/") ? alias : `kamu/${alias}`;
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0]);
    }

    public inputParamsHelper(option: string): string {
        switch (option) {
            case "SqlDataFusion":
                return "SQL DataFusion";
            case "JsonAoA":
                return "JSON AoA";
            case "ArrowJson":
                return "Arrow JSON";
            default:
                return "Unknown options";
        }
    }

    public isDatasetBlockNotFoundError(error: MaybeUndefined<VerifyQueryError>, blockHash: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetBlockNotFound &&
            (error as VerifyQueryDatasetBlockNotFoundError).block_hash === blockHash
        );
    }

    public isDatasetNotFoundError(error: MaybeUndefined<VerifyQueryError>, datasetId: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetNotFound &&
            (error as VerifyQueryDatasetNotFoundError).dataset_id === datasetId
        );
    }

    public isInputHashError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.InputHash;
    }

    public isSubQueriesHashError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.SubQueriesHash;
    }

    public isBadSignatureError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.BadSignature;
    }

    public isOutputMismatchError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.OutputMismatch;
    }

    private columnNames(schema: QueryExplainerSchemaType): string[] {
        return schema.fields.map((item) => item.name);
    }

    public tableSource(output: QueryExplainerOutputType): DataRow[] {
        const result = output.data.map((dataItem) => {
            const arr = dataItem.map((value, index) => ({ [this.columnNames(output.schema)[index]]: value }));
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        }) as DataRow[];
        return result;
    }
}
