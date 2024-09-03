import { FlowStatus } from "./../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import {
    Observable,
    Subscription,
    combineLatest,
    filter,
    map,
    shareReplay,
    switchMap,
    takeWhile,
    tap,
    timer,
} from "rxjs";
import { FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DataHelpers } from "src/app/common/data.helpers";
import { BaseDatasetDataComponent } from "src/app/common/base-dataset-data.component";
import { DatasetFlowTableHelpers } from "src/app/common/components/flows-table/flows-table.helpers";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private datasetFlowsService = inject(DatasetFlowsService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges.pipe(shareReplay());
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetViewMenuData$ = combineLatest([this.datasetBasics$, this.datasetPermissions$]).pipe(
            map(([datasetBasics, datasetPermissions]) => {
                return { datasetBasics, datasetPermissions };
            }),
            shareReplay(),
        );

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.extractActiveTabFromRoute();
            });

        this.extractActiveTabFromRoute();
        this.extractFlowIdFromRoute();
        this.loadDatasetBasicDataWithPermissions();
        this.datasetFlowDetails$ = timer(0, 5000).pipe(
            switchMap(() => this.datasetViewMenuData$),
            switchMap((data: ViewMenuData) => {
                return this.datasetFlowsService.datasetFlowById({
                    datasetId: data.datasetBasics.id,
                    flowId: this.flowId,
                });
            }),
            tap((response: MaybeUndefined<DatasetFlowByIdResponse>) => {
                if (response?.flow.status === FlowStatus.Finished) {
                    this.refreshNow();
                    this.cdr.detectChanges();
                }
            }),
            takeWhile((result: MaybeUndefined<DatasetFlowByIdResponse>) => result?.flow.status !== FlowStatus.Finished),
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
        return this.datasetService
            .requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
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
}
