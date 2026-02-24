/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, Location, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { filter, finalize, fromEvent, map, Observable, takeUntil } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, DatasetKind, OffsetInterval } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetRequestBySql } from "@interface/dataset.interface";

import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { AddDataModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/add-data-modal/add-data-modal.component";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DataSqlErrorUpdate, OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { EditorModule } from "src/app/editor/editor.module";
import ProjectLinks from "src/app/project-links";
import { SqlQueryBasicResponse } from "src/app/query/global-query/global-query.model";
import { SearchAndSchemasSectionComponent } from "src/app/query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { CancelRequestService } from "src/app/services/cancel-request.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetEntry, QueryMicroDbTrackerService } from "src/app/services/query-micro-db-tracker.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    styleUrls: ["./data.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        //-----//
        EditorModule,
        SearchAndSchemasSectionComponent,
        QueryAndResultSectionsComponent,
    ],
})
export class DataComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_DATA_KEY) public dataTabData: DatasetOverviewTabData;

    public sqlLoading: boolean;
    public sqlRequestCode = `select\n  *\nfrom `;
    private offsetColumnName = AppValues.DEFAULT_OFFSET_COLUMN_NAME;
    public overviewUpdate$: Observable<OverviewUpdate>;
    public sqlErrorMarker$: Observable<string>;
    public sqlQueryResponse$: Observable<MaybeNull<SqlQueryBasicResponse>>;
    public readonly MONACO_PLACEHOLDER = "Please type your query here...";
    private visibilityDocumentChange$ = fromEvent(document, "visibilitychange");

    private location = inject(Location);
    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private navigationService = inject(NavigationService);
    private sqlQueryService = inject(SqlQueryService);
    private cdr = inject(ChangeDetectorRef);
    private cancelRequestService = inject(CancelRequestService);
    private queryMicroDbTrackerService = inject(QueryMicroDbTrackerService);

    public ngOnInit(): void {
        this.sqlErrorMarker$ = this.sqlQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.sqlQueryResponse$ = this.sqlQueryService.sqlQueryResponseChanges;
        promiseWithCatch(
            this.buildSqlRequestCode().then(() => {
                this.runSQLRequest({ query: this.sqlRequestCode });
            }),
        );
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.dataTabData.datasetBasics;
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.onRunSQLRequest(params);
        promiseWithCatch(this.queryMicroDbTrackerService.saveQuery(this.datasetBasics.alias, params.query).then());
    }

    private async buildSqlRequestCode(): Promise<void> {
        const sqlQueryFromUrl = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY);
        if (sqlQueryFromUrl) {
            this.sqlRequestCode = sqlQueryFromUrl;
        } else {
            this.sqlRequestCode += `'${this.dataTabData.datasetBasics.alias}'`;
            const offset = this.location.getState() as MaybeNull<Partial<OffsetInterval>>;
            if (offset && typeof offset.start !== "undefined" && typeof offset.end !== "undefined") {
                this.sqlRequestCode += `\nwhere ${this.offsetColumnName}>=${offset.start} and ${this.offsetColumnName}<=${offset.end}\norder by ${this.offsetColumnName} desc`;
                return;
            }
            try {
                const entry = (await this.queryMicroDbTrackerService.getQuery(
                    this.datasetBasics.alias,
                )) as DatasetEntry;
                this.sqlRequestCode = entry.query;
            } catch {
                promiseWithCatch(
                    this.queryMicroDbTrackerService.saveQuery(this.datasetBasics.alias, this.sqlRequestCode).then(),
                );
            }
        }
    }

    public onRunSQLRequest(params: DatasetRequestBySql): void {
        this.sqlLoading = true;
        this.sqlQueryService
            // TODO: Propagate limit from UI and display when it was reached
            .requestDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.visibilityDocumentChange$.pipe(filter(() => document.visibilityState === "hidden"))),
                takeUntil(this.cancelRequestService.cancelRequestObservable),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.navigationService.navigateWithSqlQuery(params.query);
            });
    }

    public addData(overviewUpdate: OverviewUpdate): void {
        const metadata = overviewUpdate.overview.metadata;
        if (metadata.currentPollingSource || metadata.currentTransform) {
            this.updateNow();
        } else if (this.dataTabData.datasetBasics.kind === DatasetKind.Derivative) {
            this.navigationService.navigateToSetTransform({
                accountName: this.dataTabData.datasetBasics.owner.accountName,
                datasetName: this.dataTabData.datasetBasics.name,
            });
        } else {
            const modalRef: NgbModalRef = this.ngbModalService.open(AddDataModalComponent);
            const modalRefInstance = modalRef.componentInstance as AddDataModalComponent;
            modalRefInstance.datasetBasics = this.dataTabData.datasetBasics;
            modalRefInstance.overview = overviewUpdate;
        }
    }

    private updateNow(): void {
        const datasetTrigger$: Observable<boolean> =
            this.dataTabData.datasetBasics.kind === DatasetKind.Root
                ? this.datasetFlowsService.datasetTriggerIngestFlow({
                      datasetId: this.dataTabData.datasetBasics.id,
                  })
                : this.datasetFlowsService.datasetTriggerTransformFlow({
                      datasetId: this.dataTabData.datasetBasics.id,
                  });

        datasetTrigger$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((success: boolean) => {
            if (success) {
                this.navigationService.navigateToDatasetView({
                    accountName: this.dataTabData.datasetBasics.owner.accountName,
                    datasetName: this.dataTabData.datasetBasics.name,
                    tab: DatasetViewTypeEnum.Flows,
                });
            }
        });
    }
}
