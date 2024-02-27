import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { Observable, Subscription, combineLatest, filter, map, shareReplay, switchMap } from "rxjs";
import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { BaseProcessingComponent } from "src/app/common/base.processing.component";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DataHelpers } from "src/app/common/data.helpers";
import { DatasetFlowTableHelpers } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.helpers";

@Component({
    selector: "app-dataset-flow-details",
    templateUrl: "./dataset-flow-details.component.html",
    styleUrls: ["./dataset-flow-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetFlowDetailsComponent extends BaseProcessingComponent implements OnInit {
    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;
    public readonly FLOWS_TYPE = DatasetViewTypeEnum.Flows;
    public activeTab: FlowDetailsTabs = FlowDetailsTabs.SUMMARY;
    public flowId = "";
    public datasetBasics$: Observable<DatasetBasicsFragment>;
    public datasetPermissions$: Observable<DatasetPermissionsFragment>;
    public datasetViewMenuData$: Observable<ViewMenuData>;
    public datasetFlowDetails$: Observable<MaybeUndefined<DatasetFlowByIdResponse>>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datasetService: DatasetService,
        private datasetSubsService: DatasetSubscriptionsService,
        private datasetFlowsService: DatasetFlowsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges;
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetViewMenuData$ = combineLatest([this.datasetBasics$, this.datasetPermissions$]).pipe(
            map(([datasetBasics, datasetPermissions]) => {
                return { datasetBasics, datasetPermissions };
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
        this.datasetFlowDetails$ = this.datasetViewMenuData$.pipe(
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
}
