import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { Location } from "@angular/common";
import { Observable, map, tap } from "rxjs";
import AppValues from "src/app/common/app.values";
import DataTabValues from "./mock.data";
import { DatasetFlowType, DatasetKind, OffsetInterval } from "../../../api/kamu.graphql.interface";
import { DataSqlErrorUpdate, DataUpdate, OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DataRow, DatasetRequestBySql } from "../../../interface/dataset.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AddDataModalComponent } from "../overview-component/components/add-data-modal/add-data-modal.component";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    styleUrls: ["./data.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public sqlLoading: boolean;
    @Input() public resultTime: number;
    @Output() public runSQLRequestEmit = new EventEmitter<DatasetRequestBySql>();

    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode = `select\n  *\nfrom `;
    public currentData: DataRow[] = [];
    public isAllDataLoaded = false;
    public editorLoaded = false;

    private skipRows: MaybeUndefined<number>;
    private rowsLimit: number = AppValues.SQL_QUERY_LIMIT;
    private offsetColumnName = AppValues.DEFAULT_OFFSET_COLUMN_NAME;
    public sqlErrorMarker$: Observable<string>;
    public dataUpdate$: Observable<DataUpdate>;
    public overviewUpdate$: Observable<OverviewUpdate>;

    private datasetSubsService = inject(DatasetSubscriptionsService);
    private location = inject(Location);
    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private navigationService = inject(NavigationService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.overviewUpdate$ = this.datasetSubsService.overviewChanges;
        this.sqlErrorMarker$ = this.datasetSubsService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.dataUpdate$ = this.datasetSubsService.sqlQueryDataChanges.pipe(
            tap((dataUpdate: DataUpdate) => {
                if (dataUpdate.currentVocab?.offsetColumn) {
                    this.offsetColumnName = dataUpdate.currentVocab.offsetColumn;
                }
                this.isAllDataLoaded = dataUpdate.content.length < this.rowsLimit;
                this.currentData = this.skipRows ? [...this.currentData, ...dataUpdate.content] : dataUpdate.content;
                this.datasetSubsService.resetSqlError();
            }),
        );
        this.buildSqlRequestCode();
        this.runSQLRequest({ query: this.sqlRequestCode }, true);
    }

    public runSQLRequest(params: DatasetRequestBySql, initialSqlRun = false): void {
        if (initialSqlRun) {
            this.resetRowsLimits();
        }
        this.runSQLRequestEmit.emit(params);
    }

    public loadMore(limit: number): void {
        this.skipRows = this.currentData.length;
        this.rowsLimit = limit;

        const params = {
            query: this.sqlRequestCode,
            skip: this.skipRows,
            limit,
        };

        this.runSQLRequest(params);
    }

    public runSql(): void {
        this.runSQLRequest({ query: this.sqlRequestCode }, true);
    }

    public hideProgressBar(): void {
        this.editorLoaded = true;
        this.cdr.detectChanges();
    }

    private buildSqlRequestCode(): void {
        this.sqlRequestCode += `'${this.datasetBasics.alias}'`;
        const offset = this.location.getState() as MaybeNull<Partial<OffsetInterval>>;
        if (offset && typeof offset.start !== "undefined" && typeof offset.end !== "undefined") {
            this.sqlRequestCode += `\nwhere ${this.offsetColumnName}>=${offset.start} and ${this.offsetColumnName}<=${offset.end}\norder by ${this.offsetColumnName} desc`;
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
        this.trackSubscription(
            this.datasetFlowsService
                .datasetTriggerFlow({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType:
                        this.datasetBasics.kind === DatasetKind.Root
                            ? DatasetFlowType.Ingest
                            : DatasetFlowType.ExecuteTransform,
                })
                .subscribe((success: boolean) => {
                    if (success) {
                        this.navigationService.navigateToDatasetView({
                            accountName: this.datasetBasics.owner.accountName,
                            datasetName: this.datasetBasics.name,
                            tab: DatasetViewTypeEnum.Flows,
                        });
                    }
                }),
        );
    }

    private resetRowsLimits(): void {
        this.skipRows = undefined;
        this.rowsLimit = AppValues.SQL_QUERY_LIMIT;
    }
}
