import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetOverviewFragment,
    FlowStatus,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { combineLatest, map, switchMap, timer } from "rxjs";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/common/components/flows-table/flows-table-processing-base.component";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    public searchFilter = "";
    public overview: DatasetOverviewFragment;
    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1

    constructor(private datasetSubsService: DatasetSubscriptionsService) {
        super();
    }

    ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
        this.trackSubscriptions(
            this.datasetSubsService.overviewChanges.subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            }),
        );
    }

    public fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
    ): void {
        this.flowConnectionData$ = timer(0, environment.delay_polling_ms).pipe(
            switchMap(() =>
                combineLatest([
                    this.flowsService.datasetFlowsList({
                        datasetId: this.datasetBasics.id,
                        page: page - 1,
                        perPage: this.TABLE_FLOW_RUNS_PER_PAGE,
                        filters: { byStatus: filterByStatus, byInitiator: filterByInitiator },
                    }),
                    this.flowsService.datasetFlowsList({
                        datasetId: this.datasetBasics.id,
                        page: 0,
                        perPage: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: {},
                    }),
                    this.flowsService.allFlowsPaused(this.datasetBasics.id),
                    this.flowsService.flowsInitiators(this.datasetBasics.id),
                ]),
            ),
            map(([mainTableFlowsData, tileWidgetListFlowsData, allFlowsPaused, flowInitiators]) => {
                return { mainTableFlowsData, tileWidgetListFlowsData, allFlowsPaused, flowInitiators };
            }),
        );
    }

    public get isSetPollingSourceEmpty(): boolean {
        return !this.overview.metadata.currentPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetTransformEmpty(): boolean {
        return !this.overview.metadata.currentTransform && this.datasetBasics.kind === DatasetKind.Derivative;
    }

    public navigateToAddPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.navigationService.navigateToDatasetView({
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
            });
        } else {
            this.navigationService.navigateToDatasetView({
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
                page,
            });
        }
        this.fetchTableData(page);
    }

    public updateSettings(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.SCHEDULING,
        });
    }

    public updateNow(): void {
        this.trackSubscription(
            this.flowsService
                .datasetTriggerFlow({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType:
                        this.datasetBasics.kind === DatasetKind.Root
                            ? DatasetFlowType.Ingest
                            : DatasetFlowType.ExecuteTransform,
                })
                .subscribe((success: boolean) => {
                    if (success) {
                        setTimeout(() => {
                            this.refreshFlow();
                            this.cdr.detectChanges();
                        }, this.TIMEOUT_REFRESH_FLOW);
                    }
                }),
        );
    }

    public toggleStateDatasetFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.trackSubscription(
                this.flowsService
                    .datasetPauseFlows({
                        datasetId: this.datasetBasics.id,
                    })
                    .subscribe(),
            );
        } else {
            this.trackSubscription(
                this.flowsService
                    .datasetResumeFlows({
                        datasetId: this.datasetBasics.id,
                    })
                    .subscribe(),
            );
        }
        setTimeout(() => {
            this.refreshFlow();
            this.cdr.detectChanges();
        }, this.TIMEOUT_REFRESH_FLOW);
    }
}
