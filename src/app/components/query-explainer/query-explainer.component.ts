import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap, tap } from "rxjs";
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
import { ToastrService } from "ngx-toastr";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetByIdQuery } from "src/app/api/kamu.graphql.interface";

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
    private toastrService = inject(ToastrService);
    private datasetService = inject(DatasetService);
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;
    public readonly VerifyQueryKindError: typeof VerifyQueryKindError = VerifyQueryKindError;

    public blockHashObservables$: Observable<Date>[] = [];
    public datasetInfoObservables$: Observable<DatasetInfo>[] = [];
    public componentData$: Observable<{
        sqlQueryExplainerResponse: QueryExplainerResponse;
        sqlQueryVerify: MaybeNull<VerifyQueryResponse>;
    }>;

    ngOnInit(): void {
        const commitmentUploadToken = this.extractCommitmentUploadToken();
        if (commitmentUploadToken) {
            this.componentData$ = this.commitmentDataWithoutOutput(commitmentUploadToken).pipe(
                switchMap((response: QueryExplainerResponse) => {
                    const cloneData = Object.assign({}, response);
                    if ("output" in cloneData) {
                        delete cloneData.output;
                    }
                    return combineLatest([
                        of(response),
                        this.queryExplainerService.verifyQuery(cloneData).pipe(
                            catchError((e: HttpErrorResponse) => {
                                if (e.status === 400) return of(e.error as VerifyQueryResponse);
                                else {
                                    this.toastrService.error("", e.error as string, {
                                        disableTimeOut: "timeOut",
                                    });
                                    return EMPTY;
                                }
                            }),
                        ),
                    ]).pipe(
                        map(([sqlQueryExplainerResponse, sqlQueryVerify]) => ({
                            sqlQueryExplainerResponse,
                            sqlQueryVerify,
                        })),
                    );
                }),
            );
        }
    }

    private commitmentDataWithoutOutput(commitmentUploadToken: string): Observable<QueryExplainerResponse> {
        return this.queryExplainerService.fetchCommitmentDataByUploadToken(commitmentUploadToken).pipe(
            tap((response: QueryExplainerResponse) => {
                this.fillDatasetsObservables(response.input.datasets ?? []);
            }),
        );
    }

    private fillDatasetsObservables(datasets: QueryExplainerDatasetsType[]): void {
        datasets
            ?.map((dataset) => ({ datasetId: dataset.id, blockHash: dataset.blockHash }))
            .forEach(({ datasetId, blockHash }) => {
                this.datasetInfoObservables$.push(
                    this.datasetService.requestDatasetInfoById(datasetId).pipe(
                        map((dataset: DatasetByIdQuery) => {
                            return {
                                accountName:
                                    dataset.datasets.byId?.owner.accountName ?? AppValues.DEFAULT_ADMIN_ACCOUNT_NAME,
                                datasetName: dataset.datasets.byId?.name ?? "",
                            };
                        }),
                    ),
                );
                this.blockHashObservables$.push(this.blockService.requestSystemTimeBlockByHash(datasetId, blockHash));
            });
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }

    public extractCommitmentUploadToken(): string {
        const commitmentUploadToken: MaybeNull<string> = this.activatedRoute.snapshot.queryParamMap.get(
            ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN,
        );
        return commitmentUploadToken ?? "";
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
