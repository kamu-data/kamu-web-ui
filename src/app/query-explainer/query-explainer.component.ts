import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { QueryExplainerService } from "./query-explainer.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { combineLatest, map, Observable, switchMap, tap } from "rxjs";
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
    public readonly VerifyQueryKindError: typeof VerifyQueryKindError = VerifyQueryKindError;

    public blockHashObservables$: Observable<Date>[] = [];
    public datasetInfoObservables$: Observable<DatasetInfo>[] = [];
    public componentData$: Observable<QueryExplainerComponentData>;

    /* istanbul ignore next */
    ngOnInit(): void {
        const commitmentUploadToken = this.extractCommitmentUploadToken();
        if (commitmentUploadToken) {
            this.componentData$ = this.commitmentDataWithoutOutput(commitmentUploadToken).pipe(
                switchMap((response: QueryExplainerResponse) => {
                    return combineLatest([
                        this.queryExplainerService.processQuery(response.input.query, [
                            ...response.input.include,
                            "Schema",
                        ]),
                        this.queryExplainerService.verifyQuery(response),
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

    public extractCommitmentUploadToken(): string {
        const commitmentUploadToken: MaybeNull<string> = this.activatedRoute.snapshot.queryParamMap.get(
            ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN,
        );
        return commitmentUploadToken ?? "";
    }
}
