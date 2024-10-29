import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { combineLatest, map, Observable, of, switchMap, tap } from "rxjs";
import {
    QueryExplainerComponentData,
    QueryExplainerDatasetsType,
    QueryExplainerResponse,
    VerifyQueryKindError,
} from "./query-explainer.types";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
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
    ngOnInit(): void {
        this.commitmentUploadToken = this.extractCommitmentUploadToken();
        if (this.commitmentUploadToken) {
            this.componentData$ = this.commitmentDataWithoutOutput(this.commitmentUploadToken).pipe(
                switchMap((response: QueryExplainerResponse) => {
                    return combineLatest([
                        of(response),
                        this.queryExplainerService.processQuery(response.input.query, ["Schema"]),
                        this.queryExplainerService.verifyQuery(response),
                    ]).pipe(
                        map(([commitmentData, outputData, sqlQueryVerify]) => {
                            const result = Object.assign({}, outputData, commitmentData);
                            return {
                                sqlQueryExplainerResponse: result,
                                sqlQueryVerify,
                            };
                        }),
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
            this.componentData$ = combineLatest([
                of(parsedCommitment),
                this.queryExplainerService.processQuery(parsedCommitment.input.query, ["Schema"]),
                this.queryExplainerService.verifyQuery(parsedCommitment),
            ]).pipe(
                tap(([t]) => this.fillDatasetsObservables(t.input.datasets ?? [])),
                map(([commitmentData, outputData, sqlQueryVerify]) => {
                    const result = Object.assign({}, outputData, commitmentData);
                    return {
                        sqlQueryExplainerResponse: result,
                        sqlQueryVerify,
                    };
                }),
            );
        } catch (e) {
            this.toastrService.error("Impossible to parse the commitment");
        }
    }
}
