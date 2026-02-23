/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { combineLatest, map, Observable, of, switchMap, tap } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import AppValues from "@common/values/app.values";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { CommitmentDataSectionComponent } from "src/app/query-explainer/components/commitment-data-section/commitment-data-section.component";
import { InputDataSectionComponent } from "src/app/query-explainer/components/input-data-section/input-data-section.component";
import { ReproducedResultSectionComponent } from "src/app/query-explainer/components/reproduced-result-section/reproduced-result-section.component";
import { VerifyResultSectionComponent } from "src/app/query-explainer/components/verify-result-section/verify-result-section.component";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";
import {
    QueryExplainerDatasetsType,
    QueryExplainerResponse,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "src/app/query-explainer/query-explainer.types";

export interface QueryExplainerComponentData {
    sqlQueryExplainerResponse: QueryExplainerResponse;
    sqlQueryVerify: MaybeNull<VerifyQueryResponse>;
}

@Component({
    selector: "app-query-explainer",
    templateUrl: "./query-explainer.component.html",
    styleUrls: ["./query-explainer.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgIf,
        //-----//
        VerifyResultSectionComponent,
        InputDataSectionComponent,
        CommitmentDataSectionComponent,
        ReproducedResultSectionComponent,
    ],
})
export class QueryExplainerComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN) public set uploadToken(value: string) {
        this.commitmentUploadToken = value ?? "";
    }

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

    /* istanbul ignore next */
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

    /* istanbul ignore next */
    public async verifyCommitment(): Promise<void> {
        try {
            const parsedCommitment = (await JSON.parse(this.commitment)) as QueryExplainerResponse;
            this.commitmentUploadToken = "simulated-token";
            this.componentData$ = this.combineQueryExplainerResponse(parsedCommitment);
        } catch {
            this.toastrService.error("Impossible to parse the commitment");
        }
    }

    /* istanbul ignore next */
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
