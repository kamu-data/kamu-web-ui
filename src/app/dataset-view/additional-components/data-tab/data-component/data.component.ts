import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { finalize, map, Observable } from "rxjs";
import AppValues from "src/app/common/app.values";
import { DatasetFlowType, DatasetKind, OffsetInterval } from "../../../../api/kamu.graphql.interface";
import { DataSqlErrorUpdate, OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql } from "../../../../interface/dataset.interface";
import { DatasetSubscriptionsService } from "../../../dataset.subscriptions.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AddDataModalComponent } from "../../overview-component/components/add-data-modal/add-data-modal.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetViewTypeEnum } from "../../../dataset-view.interface";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SqlQueryResponseState } from "src/app/query/global-query/global-query.model";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { DatasetService } from "../../../dataset.service";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent extends BaseComponent implements OnInit {
    public datasetBasics: DatasetBasicsFragment;
    public sqlLoading: boolean = false;
    public sqlRequestCode = `select\n  *\nfrom `;

    private offsetColumnName = AppValues.DEFAULT_OFFSET_COLUMN_NAME;
    public overviewUpdate$: Observable<OverviewUpdate>;
    public sqlErrorMarker$: Observable<string>;
    public sqlQueryResponse$: Observable<MaybeNull<SqlQueryResponseState>>;
    public readonly MONACO_PLACEHOLDER = "Please type your guery here...";

    private datasetSubsService = inject(DatasetSubscriptionsService);
    private location = inject(Location);
    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private navigationService = inject(NavigationService);
    private sqlQueryService = inject(SqlQueryService);
    protected datasetService = inject(DatasetService);
    protected cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.datasetService.datasetChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((datasetBasics) => {
            this.datasetBasics = datasetBasics;
        });
        this.overviewUpdate$ = this.datasetSubsService.overviewChanges;
        this.sqlErrorMarker$ = this.sqlQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.sqlQueryResponse$ = this.sqlQueryService.sqlQueryResponseChanges;
        this.buildSqlRequestCode();
        this.runSQLRequest({ query: this.sqlRequestCode });
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.onRunSQLRequest(params);
    }

    public onRunSQLRequest(params: DatasetRequestBySql): void {
        this.sqlLoading = true;
        this.sqlQueryService
            // TODO: Propagate limit from UI and display when it was reached
            .requestDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        this.cdr.detectChanges();
    }

    private buildSqlRequestCode(): void {
        const sqlQueryFromUrl = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY);
        if (sqlQueryFromUrl) {
            this.sqlRequestCode = sqlQueryFromUrl;
        } else {
            this.sqlRequestCode += `'${this.datasetBasics.alias}'`;
            const offset = this.location.getState() as MaybeNull<Partial<OffsetInterval>>;
            if (offset && typeof offset.start !== "undefined" && typeof offset.end !== "undefined") {
                this.sqlRequestCode += `\nwhere ${this.offsetColumnName}>=${offset.start} and ${this.offsetColumnName}<=${offset.end}\norder by ${this.offsetColumnName} desc`;
            }
        }
    }

    public addData(overviewUpdate: OverviewUpdate): void {
        const metadata = overviewUpdate.overview.metadata;
        if (metadata.currentPollingSource || metadata.currentTransform) {
            this.updateNow();
        } else if (this.datasetBasics.kind === DatasetKind.Derivative) {
            this.navigationService.navigateToSetTransform({
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
            });
        } else {
            const modalRef: NgbModalRef = this.ngbModalService.open(AddDataModalComponent);
            const modalRefInstance = modalRef.componentInstance as AddDataModalComponent;
            modalRefInstance.datasetBasics = this.datasetBasics;
            modalRefInstance.overview = overviewUpdate;
        }
    }

    private updateNow(): void {
        this.datasetFlowsService
            .datasetTriggerFlow({
                datasetId: this.datasetBasics.id,
                datasetFlowType:
                    this.datasetBasics.kind === DatasetKind.Root
                        ? DatasetFlowType.Ingest
                        : DatasetFlowType.ExecuteTransform,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.accountName,
                        datasetName: this.datasetBasics.name,
                        tab: DatasetViewTypeEnum.Flows,
                    });
                }
            });
    }
}