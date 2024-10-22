import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import {
    QueryExplainerDatasetsType,
    QueryExplainerResponse,
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "./query-explainer.types";
import { HttpErrorResponse } from "@angular/common/http";
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
    private blockService = inject(BlockService);
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;
    public readonly VerifyQueryKindError: typeof VerifyQueryKindError = VerifyQueryKindError;

    public sqlQueryExplainerResponse: QueryExplainerResponse;
    public blockHashObservables$: Observable<Date>[] = [];
    public componentData$: Observable<{
        sqlQueryExplainerResponse: QueryExplainerResponse;
        sqlQueryVerify: VerifyQueryResponse;
    }>;

    ngOnInit(): void {
        const commitmentUploadToken = this.extractCommitmentUploadId();
        if (commitmentUploadToken) {
            this.componentData$ = this.commitmentDataWithoutOutput(commitmentUploadToken).pipe(
                switchMap((response: QueryExplainerResponse) => {
                    return this.queryExplainerService.verifyQuery(response);
                }),
                catchError((e: HttpErrorResponse) => {
                    return of(e.error as VerifyQueryResponse);
                }),
                map((verifyResponse: VerifyQueryResponse) => {
                    return {
                        sqlQueryVerify: verifyResponse,
                        sqlQueryExplainerResponse: this.sqlQueryExplainerResponse,
                    };
                }),
            );
        }
    }

    private commitmentDataWithoutOutput(commitmentUploadToken: string): Observable<QueryExplainerResponse> {
        return this.queryExplainerService.fetchCommitmentDataByUploadToken(commitmentUploadToken).pipe(
            tap((response: QueryExplainerResponse) => {
                this.sqlQueryExplainerResponse = response;
                this.fillBlockHashObservables(response.input.datasets ?? []);
            }),
            map((data: QueryExplainerResponse) => {
                const cloneData = Object.assign({}, data);
                if ("output" in cloneData) {
                    delete cloneData.output;
                }
                return cloneData;
            }),
        );
    }

    private fillBlockHashObservables(datasets: QueryExplainerDatasetsType[]): void {
        datasets
            ?.map((dataset) => ({ datasetId: dataset.id, blockHash: dataset.blockHash }))
            .forEach(({ datasetId, blockHash }) => {
                this.blockHashObservables$.push(this.blockService.requestSystemTimeBlockByHash(datasetId, blockHash));
            });
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }

    private extractCommitmentUploadId(): string {
        const commitmentUploadId: MaybeUndefined<string> = this.activatedRoute.snapshot.queryParams[
            ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN
        ] as MaybeUndefined<string>;
        return commitmentUploadId ?? "";
    }

    public routeToDataset(alias: string): string {
        return alias.includes("/") ? alias : `kamu/${alias}`;
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
}
