import { DatasetFlowType, DatasetKind } from "./../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { Observable, Subscription, combineLatest, filter, map, shareReplay, switchMap, timer } from "rxjs";
import { DatasetBasicsFragment, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DataHelpers } from "src/app/common/data.helpers";
import { DatasetFlowTableHelpers } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.helpers";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { BaseDatasetDataComponent } from "src/app/common/base-dataset-data.component";

@Component({
    selector: "app-dataset-flow-details",
    templateUrl: "./dataset-flow-details.component.html",
    styleUrls: ["./dataset-flow-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetFlowDetailsComponent extends BaseDatasetDataComponent implements OnInit {
    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;
    public readonly FLOWS_TYPE = DatasetViewTypeEnum.Flows;
    public activeTab: FlowDetailsTabs = FlowDetailsTabs.SUMMARY;
    public flowId = "";
    public datasetViewMenuData$: Observable<ViewMenuData>;
    public datasetFlowDetails$: Observable<MaybeUndefined<DatasetFlowByIdResponse>>;
    public allFlowsPaused$: Observable<MaybeUndefined<boolean>>;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datasetFlowsService: DatasetFlowsService,
        private flowsService: DatasetFlowsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges.pipe(shareReplay());
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.allFlowsPaused$ = this.datasetBasics$.pipe(
            switchMap((data: DatasetBasicsFragment) => this.flowsService.allFlowsPaused(data.id)),
        );
        this.datasetViewMenuData$ = combineLatest([
            this.datasetBasics$,
            this.datasetPermissions$,
            this.allFlowsPaused$,
        ]).pipe(
            map(([datasetBasics, datasetPermissions, allFlowsPaused]) => {
                return { datasetBasics, datasetPermissions, allFlowsPaused };
            }),
            shareReplay(),
        );
        this.trackSubscription(
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                this.extractActiveTabFromRoute();
            }),
        );

        this.extractActiveTabFromRoute();
        this.extractFlowIdFromRoute();
        this.trackSubscriptions(this.loadDatasetBasicDataWithPermissions());
        this.datasetFlowDetails$ = timer(0, 10000).pipe(
            switchMap(() => this.datasetViewMenuData$),
            switchMap((data: ViewMenuData) => {
                return this.datasetFlowsService.datasetFlowById({
                    datasetId: data.datasetBasics.id,
                    flowId: this.flowId,
                });
            }),
        );
    }

    public getRouteLink(tab: FlowDetailsTabs): string {
        return `/${this.getDatasetInfoFromUrl().accountName}/${this.getDatasetInfoFromUrl().datasetName}/${
            ProjectLinks.URL_FLOW_DETAILS
        }/${this.flowId}/${tab}`;
    }

    public get datasetInfo(): DatasetInfo {
        return this.getDatasetInfoFromUrl();
    }

    private extractActiveTabFromRoute(): void {
        const categoryParam: MaybeUndefined<string> = this.route.snapshot.params[
            ProjectLinks.URL_PARAM_CATEGORY
        ] as MaybeUndefined<string>;
        if (categoryParam) {
            const category = categoryParam as FlowDetailsTabs;
            if (Object.values(FlowDetailsTabs).includes(category)) {
                this.activeTab = category;
                return;
            }
        }
        this.activeTab = FlowDetailsTabs.SUMMARY;
    }

    private extractFlowIdFromRoute(): void {
        const flowIdParam: MaybeUndefined<string> = this.route.snapshot.params[
            ProjectLinks.URL_PARAM_FLOW_ID
        ] as MaybeUndefined<string>;
        if (flowIdParam) {
            this.flowId = flowIdParam;
        }
    }

    private loadDatasetBasicDataWithPermissions(): Subscription {
        return this.datasetService.requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl()).subscribe();
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return DataHelpers.flowTypeDescription(flow);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.descriptionEndOfMessage(element);
    }

    public descriptionColumnOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        return DatasetFlowTableHelpers.descriptionColumnTableOptions(element);
    }

    public refreshNow(): void {
        this.datasetFlowDetails$ = this.datasetViewMenuData$.pipe(
            switchMap((data: ViewMenuData) => {
                return this.datasetFlowsService.datasetFlowById({
                    datasetId: data.datasetBasics.id,
                    flowId: this.flowId,
                });
            }),
        );
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        this.trackSubscription(
            this.flowsService
                .datasetTriggerFlow({
                    datasetId: datasetBasics.id,
                    datasetFlowType:
                        datasetBasics.kind === DatasetKind.Root
                            ? DatasetFlowType.Ingest
                            : DatasetFlowType.ExecuteTransform,
                })
                .subscribe((success: boolean) => {
                    if (success) {
                        this.getDatasetNavigation(this.getDatasetInfoFromUrl()).navigateToFlows();
                    }
                }),
        );
    }

    public updateSettings(datasetBasics: DatasetBasicsFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: datasetBasics.owner.accountName,
            datasetName: datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.SCHEDULING,
        });
    }

    public toggleStateDatasetFlowConfigs(paused: boolean, datasetBasics: DatasetBasicsFragment): void {
        if (!paused) {
            this.trackSubscription(
                this.flowsService
                    .datasetPauseFlows({
                        datasetId: datasetBasics.id,
                    })
                    .subscribe(() => this.getDatasetNavigation(this.getDatasetInfoFromUrl()).navigateToFlows()),
            );
        } else {
            this.trackSubscription(
                this.flowsService
                    .datasetResumeFlows({
                        datasetId: datasetBasics.id,
                    })
                    .subscribe(() => this.getDatasetNavigation(this.getDatasetInfoFromUrl()).navigateToFlows()),
            );
        }
    }
}
