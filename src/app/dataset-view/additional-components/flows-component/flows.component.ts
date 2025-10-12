/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    DatasetFlowProcesses,
    DatasetFlowType,
    DatasetKind,
    FlowProcessAutoStopReason,
    FlowProcessEffectiveState,
    FlowProcessTypeFilterInput,
    FlowStatus,
    InitiatorFilterInput,
    WebhookFlowSubProcess,
    AccountFragment,
} from "src/app/api/kamu.graphql.interface";
import { combineLatest, map, Observable, of, switchMap, take, tap, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FlowsTableData, FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import ProjectLinks from "src/app/project-links";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { FlowsTableComponent } from "../../../dataset-flow/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../../../dataset-flow/tile-base-widget/tile-base-widget.component";
import { RouterLink } from "@angular/router";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NgIf, AsyncPipe, NgClass, NgFor } from "@angular/common";
import AppValues from "src/app/common/values/app.values";
import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { SubprocessStatusFilterPipe } from "./pipes/subprocess-status-filter.pipe";
import { DatasetWebhooksService } from "../dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { FormsModule } from "@angular/forms";
import {
    FlowsCategoryUnion,
    FlowsSelectedCategory,
    WebhooksSelectedCategory,
    webhooksStateMapper,
    WebhooksFiltersOptions,
    FlowsSelectionState,
} from "./flows.helpers";
import { FlowsBlockActionsComponent } from "./components/flows-block-actions/flows-block-actions.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FlowsBadgePanelComponent } from "./components/flows-badge-panel/flows-badge-panel.component";
@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgClass,
        NgIf,
        NgFor,
        RouterLink,

        //-----//
        MatMenuModule,
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatChipsModule,

        //-----//
        FlowsTableComponent,
        FlowsBlockActionsComponent,
        FlowsBadgePanelComponent,
        TileBaseWidgetComponent,
        PaginationComponent,
        SubprocessStatusFilterPipe,
    ],
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_FLOWS_KEY) public flowsData: DatasetOverviewTabData;
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOK_ID) public set setWebhookId(value: MaybeNull<string>) {
        this.flowsSelectionState.webhooksIds = value ? value.split(",") : [];
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOKS_STATE) public set setWebhookState(value: MaybeNull<string>) {
        this.flowsSelectionState.webhookFilterButtons = value ? (value.split(",") as FlowProcessEffectiveState[]) : [];
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_FLOWS_CATEGORY) public set setFlowsCategory(value: FlowsCategoryUnion) {
        value === "webhooks"
            ? (this.flowsSelectionState.webhooksCategory = value)
            : (this.flowsSelectionState.flowsCategory = value);
    }

    private datasetWebhooksService = inject(DatasetWebhooksService);

    public flowConnectionData$: Observable<{
        flowsData: FlowsTableData;
        flowInitiators: AccountFragment[];
        flowProcesses?: DatasetFlowProcesses;
    }>;
    public flowsProcesses$: Observable<DatasetFlowProcesses>;
    public flowsSelectionState: FlowsSelectionState = {
        flowsCategory: undefined,
        webhooksCategory: undefined,
        webhookFilterButtons: [],
        webhooksIds: [],
        subscriptions: [],
    };
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly FlowProcessAutoStopReason: typeof FlowProcessAutoStopReason = FlowProcessAutoStopReason;

    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly DatasetFlowType: typeof DatasetFlowType = DatasetFlowType;
    public readonly WEBHOOKS_FILTERS_OPTIONS = WebhooksFiltersOptions;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    public get showSubprocessesTable(): boolean {
        return this.isWebhookCategoryActive || Boolean(this.flowsSelectionState.webhooksIds.length);
    }

    public get isWebhookCategoryActive(): boolean {
        return this.flowsSelectionState.webhooksCategory === "webhooks";
    }

    public get showPanelButtons(): boolean {
        return !this.hasPushSources;
    }

    public removeSelectedWebhook(subscriptionName: string, subprocesses: WebhookFlowSubProcess[]): void {
        const index = this.flowsSelectionState.subscriptions.indexOf(subscriptionName);
        if (index >= 0) {
            this.flowsSelectionState.subscriptions.splice(index, 1);
        }
        const removedId = subprocesses.filter((item) => item.name === subscriptionName)[0].id;
        this.flowsSelectionState.webhooksIds = this.flowsSelectionState.webhooksIds.filter(
            (item) => item !== removedId,
        );

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: this.flowsSelectionState.webhooksIds,
        });
        this.refreshFlow();
    }

    public onToggleWebhookFilter(event: MatButtonToggleChange, subprocesses: WebhookFlowSubProcess[]): void {
        const states = event.value as FlowProcessEffectiveState[];
        this.flowsSelectionState.subscriptions = [];
        this.flowsSelectionState.webhooksIds = subprocesses
            .filter((x) => states.includes(x.summary.effectiveState))
            .map((item) => item.id);
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: this.flowsSelectionState.flowsCategory as FlowsCategoryUnion,
            webhooksState: states.length ? states : undefined,
        });
        this.refreshFlow();
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.flowsData.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public navigateToSubscription(process: WebhookFlowSubProcess): void {
        if (this.flowsSelectionState.webhooksCategory || this.flowsSelectionState.flowsCategory) {
            this.flowsSelectionState.webhooksIds = [];
        }
        if (!this.flowsSelectionState.subscriptions.includes(process.name)) {
            this.flowsSelectionState.subscriptions.push(process.name);
            this.flowsSelectionState.webhooksIds.push(process.id);
        }
        this.flowsSelectionState.webhookFilterButtons = [];
        this.flowsSelectionState.webhooksCategory = undefined;

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: this.flowsSelectionState.webhooksIds,
        });
        this.refreshFlow();
    }

    public pauseWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookPauseSubscription(this.flowsData.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
                }
            });
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.flowsData.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
                }
            });
    }

    public fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
    ): void {
        this.flowConnectionData$ = timer(0, environment.delay_polling_ms).pipe(
            switchMap(() => this.flowsService.datasetFlowsProcesses({ datasetId: this.flowsData.datasetBasics.id })),
            tap((flowProcesses: DatasetFlowProcesses) => {
                this.initFlowsSelectionState(flowProcesses);
            }),
            switchMap((flowProcesses: DatasetFlowProcesses) =>
                combineLatest([
                    this.flowsService.datasetFlowsList({
                        datasetId: this.flowsData.datasetBasics.id,
                        page: page - 1,
                        perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                        perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: {
                            byStatus: filterByStatus,
                            byInitiator: filterByInitiator,
                            byProcessType: this.setProcessTypeFilter(
                                this.flowsSelectionState.webhooksIds,
                                this.flowsSelectionState.flowsCategory,
                                this.flowsSelectionState.webhooksCategory,
                            ),
                        },
                    }),
                    this.flowsService.flowsInitiators(this.flowsData.datasetBasics.id),
                    of(flowProcesses),
                ]),
            ),

            map(([flowsData, flowInitiators, flowProcesses]) => {
                console.log("pro=", flowProcesses);
                return { flowsData, flowInitiators, flowProcesses };
            }),
        );
    }

    private initFlowsSelectionState(flowProcesses: DatasetFlowProcesses): void {
        const subprocessesNames = flowProcesses.webhooks.subprocesses
            .filter((item) => this.flowsSelectionState.webhooksIds.includes(item.id))
            .map((x) => x.name);
        this.flowsSelectionState.subscriptions = subprocessesNames;

        if (this.flowsSelectionState.webhookFilterButtons.length) {
            this.flowsSelectionState.webhooksIds = flowProcesses.webhooks.subprocesses
                .filter((item) => this.flowsSelectionState.webhookFilterButtons.includes(item.summary.effectiveState))
                .map((x) => x.id);
        }
    }

    private setProcessTypeFilter(
        webhookId: string[],
        datasetFlowFilter: MaybeUndefined<FlowsSelectedCategory>,
        webhooksFilter: MaybeUndefined<WebhooksSelectedCategory>,
    ): MaybeNull<FlowProcessTypeFilterInput> {
        if (webhookId.length) {
            this.flowsSelectionState.flowsCategory = undefined;

            return {
                primary: undefined,
                webhooks: { subscriptionIds: this.flowsSelectionState.webhooksIds },
            };
        }
        if (webhooksFilter === "webhooks") {
            return {
                primary: undefined,
                webhooks: { subscriptionIds: this.flowsSelectionState.webhooksIds },
            };
        }
        if (datasetFlowFilter === "updates") {
            return {
                primary: { byFlowTypes: [this.isRoot ? DatasetFlowType.Ingest : DatasetFlowType.ExecuteTransform] },
                webhooks: undefined,
            };
        }
        this.flowsSelectionState.flowsCategory = "all";
        return null;
    }

    public onSelectionFlowsChange(event: MatChipListboxChange): void {
        this.flowsSelectionState.webhooksCategory = undefined;
        this.flowsSelectionState.webhookFilterButtons = [];
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: event.value as FlowsCategoryUnion,
        });
        this.refreshFlow();
    }

    public onSelectionWebhooksChange(event: MatChipListboxChange): void {
        this.flowsSelectionState.flowsCategory = undefined;
        const category = event.value as FlowsCategoryUnion;
        if (category && this.flowsSelectionState.webhookFilterButtons.length) {
            this.flowsSelectionState.webhookFilterButtons = [];
            this.flowsSelectionState.subscriptions = [];
        }
        if (!category) {
            this.flowsSelectionState.webhooksIds = [];
        }

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: category ?? undefined,
        });

        this.refreshFlow();
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
        this.flowsSelectionState.webhookFilterButtons = [];
        this.flowsSelectionState.webhooksIds = [];
        this.navigationService.navigateToWebhooks({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: subscriptionId,
        });
    }

    public get isRoot(): boolean {
        return this.flowsData.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetPollingSourceEmpty(): boolean {
        return (
            !this.flowsData.overviewUpdate.overview.metadata.currentPollingSource &&
            this.flowsData.datasetBasics.kind === DatasetKind.Root &&
            !this.hasPushSources
        );
    }

    public get isSetTransformEmpty(): boolean {
        return (
            !this.flowsData.overviewUpdate.overview.metadata.currentTransform &&
            this.flowsData.datasetBasics.kind === DatasetKind.Derivative &&
            !this.hasPushSources
        );
    }

    public get hasPushSources(): boolean {
        return Boolean(this.flowsData.overviewUpdate.overview.metadata.currentPushSources.length);
    }

    public get canRunFlows(): boolean {
        return this.flowsData.datasetPermissions.permissions.flows.canRun;
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.navigationService.navigateToDatasetView({
                accountName: this.flowsData.datasetBasics.owner.accountName,
                datasetName: this.flowsData.datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
            });
        } else {
            this.navigationService.navigateToDatasetView({
                accountName: this.flowsData.datasetBasics.owner.accountName,
                datasetName: this.flowsData.datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
                page,
            });
        }
        this.fetchTableData(page);
    }

    public updateNow(): void {
        const datasetTrigger$: Observable<boolean> =
            this.flowsData.datasetBasics.kind === DatasetKind.Root
                ? this.flowsService.datasetTriggerIngestFlow({
                      datasetId: this.flowsData.datasetBasics.id,
                  })
                : this.flowsService.datasetTriggerTransformFlow({
                      datasetId: this.flowsData.datasetBasics.id,
                  });

        datasetTrigger$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((success: boolean) => {
            if (success) {
                setTimeout(() => {
                    this.refreshFlow();
                    this.cdr.detectChanges();
                }, this.TIMEOUT_REFRESH_FLOW);
            }
        });
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        if (!filters) {
            this.searchByAccount = [];
        }
        this.searchByFilters(filters);
    }

    public webhooksStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public trackBySubscriptionId(index: number, item: WebhookFlowSubProcess): string {
        return item.id;
    }
}
