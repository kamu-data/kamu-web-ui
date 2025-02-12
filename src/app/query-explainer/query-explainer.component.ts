import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/values/app.values";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { MaybeNull } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { combineLatest, map, Observable, of, switchMap, tap } from "rxjs";
import {
    QueryExplainerDatasetsType,
    QueryExplainerResponse,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "./query-explainer.types";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetByIdQuery } from "src/app/api/kamu.graphql.interface";

export interface QueryExplainerComponentData {
    sqlQueryExplainerResponse: QueryExplainerResponse;
    sqlQueryVerify: MaybeNull<VerifyQueryResponse>;
}

@Component({
    selector: "app-query-explainer",
    templateUrl: "./query-explainer.component.html",
    styleUrls: ["./query-explainer.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryExplainerComponent extends BaseComponent implements OnInit {
    private queryExplainerService = inject(QueryExplainerService);
    private blockService = inject(BlockService);
    private datasetService = inject(DatasetService);
    private toastrService = inject(ToastrService);
    public commitmentUploadToken: MaybeNull<string>;
    public commitment: string;
    public readonly VerifyQueryKindError: typeof VerifyQueryKindError = VerifyQueryKindError;

    public blockHashObservables$: Observable<Date>[] = [];
    public datasetInfoObservables$: Observable<DatasetInfo>[] = [];
    public componentData$: Observable<QueryExplainerComponentData>;

    /* istanbul ignore next */
    public ngOnInit(): void {
        this.commitmentUploadToken = this.extractCommitmentUploadToken();
        if (this.commitmentUploadToken) {
            this.componentData$ = this.queryExplainerService
                .fetchCommitmentDataByUploadToken(this.commitmentUploadToken)
                .pipe(
                    switchMap((uploadedCommitment: QueryExplainerResponse) => {
                        return this.combineQueryExplainerResponse(uploadedCommitment);
                    }),
                );
        }
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

    public extractCommitmentUploadToken(): string {
        const commitmentUploadToken: MaybeNull<string> = this.activatedRoute.snapshot.queryParamMap.get(
            ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN,
        );
        return commitmentUploadToken ?? "";
    }

    /* istanbul ignore next */
    public async verifyCommitment(): Promise<void> {
        try {
            const parsedCommitment = (await JSON.parse(this.commitment)) as QueryExplainerResponse;
            this.commitmentUploadToken = "simulated-token";
            this.componentData$ = this.combineQueryExplainerResponse(parsedCommitment);
        } catch (e) {
            this.toastrService.error("Impossible to parse the commitment");
        }
    }

    private combineQueryExplainerResponse(
        parsedCommitment: QueryExplainerResponse,
    ): Observable<QueryExplainerComponentData> {
        return combineLatest([
            of(parsedCommitment),
            this.queryExplainerService.processQueryWithSchema(parsedCommitment.input.query),
            this.queryExplainerService.verifyQuery(parsedCommitment),
        ]).pipe(
            tap(([commitment]) => this.fillDatasetsObservables(commitment.input.datasets ?? [])),
            map(([commitment, dataJsonAoS, sqlQueryVerify]) => {
                return {
                    sqlQueryExplainerResponse: {
                        ...commitment,
                        ...dataJsonAoS,
                    },
                    sqlQueryVerify,
                };
            }),
        );
    }
}
