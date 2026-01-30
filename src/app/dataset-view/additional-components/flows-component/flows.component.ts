/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    AccountFragment,
    DatasetBasicsFragment,
    DatasetFlowProcesses,
    DatasetFlowType,
    DatasetKind,
    FlowProcessEffectiveState,
    FlowProcessTypeFilterInput,
    FlowStatus,
    InitiatorFilterInput,
    WebhookFlowSubProcess,
} from "src/app/api/kamu.graphql.interface";
import { combineLatest, map, Observable, of, switchMap, take, tap, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FilterStatusType, FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
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
import { NgIf, AsyncPipe, NgClass } from "@angular/common";
import AppValues from "src/app/common/values/app.values";
import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { FormsModule } from "@angular/forms";
import {
    FlowsCategoryUnion,
    FlowsSelectedCategory,
    WebhooksSelectedCategory,
    FlowsSelectionState,
    DatasetFlowsTabState,
} from "./flows.helpers";
import { FlowsBlockActionsComponent } from "./components/flows-block-actions/flows-block-actions.component";
import { FlowsAssociatedChannelsComponent } from "./components/flows-associated-channels/flows-associated-channels.component";
import { DatasetWebhooksService } from "../dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { FlowsSelectionStateService } from "./services/flows-selection-state.service";
import { FlowTablePanelFiltersComponent } from "src/app/dataset-flow/flows-table/components/flow-table-panel-filters/flow-table-panel-filters.component";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";
@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FlowsSelectionStateService],
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgClass,
        NgIf,
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
        FlowsAssociatedChannelsComponent,
        FlowTablePanelFiltersComponent,
        DatasetFlowProcessCardComponent,
        TileBaseWidgetComponent,
        PaginationComponent,
    ],
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_FLOWS_KEY) public flowsData: DatasetOverviewTabData;
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOK_ID) public set setWebhookId(value: MaybeNull<string>) {
        const ids = value ? value.split(",") : [];
        ids.forEach((id: string) => this.flowsSelectionStateService.addWebhookId(id));
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOKS_STATE) public set setWebhookState(value: MaybeNull<string>) {
        const states = value ? (value.split(",") as FlowProcessEffectiveState[]) : [];
        this.flowsSelectionStateService.setWebhookFilterButtons(states);
        if (this.flowsSelectionState.webhookFilterButtons.length) {
            this.flowsSelectionStateService.setWebhooksCategory("webhooks");
        }
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_FLOWS_CATEGORY) public set setFlowsCategory(value: FlowsCategoryUnion) {
        value === "webhooks"
            ? this.flowsSelectionStateService.setWebhooksCategory(value)
            : this.flowsSelectionStateService.setFlowsCategory(value);
    }

    public selectedDatasetItems: DatasetBasicsFragment[] = [];
    public selectedAccountItems: AccountFragment[] = [];
    public selectedStatusItems: FilterStatusType[] = [];

    private datasetWebhooksService = inject(DatasetWebhooksService);
    private flowsSelectionStateService = inject(FlowsSelectionStateService);
    private datasetCardService = inject(ProcessDatasetCardInteractionService);

    public flowsProcesses$: Observable<DatasetFlowProcesses>;

    public flowConnectionData$: Observable<DatasetFlowsTabState>;

    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;

    public ngOnInit(): void {
        this.filterByStatus = null;
        this.refreshFlow();
    }

    public get showPanelButtons(): boolean {
        return !this.hasPushSources;
    }

    public get flowsSelectionState(): FlowsSelectionState {
        return this.flowsSelectionStateService.snapshot;
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.flowsData.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus[]>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
    ): void {
        this.flowConnectionData$ = timer(0, environment.delay_polling_ms).pipe(
            switchMap(() => this.flowsService.datasetFlowsProcesses({ datasetId: this.flowsData.datasetBasics.id })),
            tap((flowProcesses: DatasetFlowProcesses) => {
                const modifiedRollup = {
                    ...flowProcesses.webhooks.rollup,
                    paused: flowProcesses.webhooks.rollup.paused + flowProcesses.webhooks.rollup.unconfigured,
                };
                flowProcesses.webhooks.rollup = modifiedRollup;
                this.flowsSelectionStateService.initFlowsSelectionState(flowProcesses);
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
                return { flowsData, flowInitiators, flowProcesses };
            }),
        );
    }

    private setProcessTypeFilter(
        webhookId: string[],
        datasetFlowFilter: MaybeUndefined<FlowsSelectedCategory>,
        webhooksFilter: MaybeUndefined<WebhooksSelectedCategory>,
    ): MaybeNull<FlowProcessTypeFilterInput> {
        if (webhookId.length) {
            this.flowsSelectionStateService.clearFlowsCategory();
            return {
                primary: undefined,
                webhooks: { subscriptionIds: this.flowsSelectionState.webhooksIds },
            };
        }
        if (webhooksFilter === "webhooks") {
            this.flowsSelectionStateService.clearFlowsCategory();
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
        this.flowsSelectionStateService.setFlowsCategory("all");
        return null;
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
        this.flowsSelectionStateService.clearWebhookFilters();
        this.flowsSelectionStateService.clearWebhookIds();
        this.navigationService.navigateToWebhooks({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: subscriptionId,
        });
    }

    public navigateToSubscription(process: WebhookFlowSubProcess): void {
        this.flowsSelectionStateService.selectSubscription(process);
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

    public onSelectionFlowsChange(event: MatChipListboxChange): void {
        this.flowsSelectionStateService.reset();
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: event.value as FlowsSelectedCategory,
        });
        this.refreshFlow();
    }

    public onSelectionWebhooksChange(category: MaybeUndefined<WebhooksSelectedCategory>): void {
        this.flowsSelectionStateService.selectWebhookChip(category);
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: category,
        });
        this.refreshFlow();
    }

    public onToggleWebhookFilter(states: FlowProcessEffectiveState[], subprocesses: WebhookFlowSubProcess[]): void {
        this.flowsSelectionStateService.clearSubscription();
        this.flowsSelectionStateService.clearWebhookIds();
        subprocesses
            .filter((x) => states.includes(x.summary.effectiveState))
            .map((item) => item.id)
            .forEach((id) => this.flowsSelectionStateService.addWebhookId(id));
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: this.flowsSelectionState.flowsCategory as WebhooksSelectedCategory,
            webhooksState: states.length ? states : undefined,
        });
        this.refreshFlow();
    }

    public removeSelectedWebhook(subscriptionName: string, subprocesses: WebhookFlowSubProcess[]): void {
        this.flowsSelectionStateService.removeSubscription(subscriptionName);
        const removedId = subprocesses.filter((item) => item.name === subscriptionName)[0].id;
        this.flowsSelectionStateService.removeWebhookId(removedId);

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: this.flowsSelectionState.webhooksIds,
        });
        this.refreshFlow();
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
                category: this.flowsSelectionState.webhooksCategory ?? this.flowsSelectionState.flowsCategory,
                tab: DatasetViewTypeEnum.Flows,
            });
        } else {
            this.navigationService.navigateToDatasetView({
                accountName: this.flowsData.datasetBasics.owner.accountName,
                datasetName: this.flowsData.datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
                category: this.flowsSelectionState.webhooksCategory ?? this.flowsSelectionState.flowsCategory,
                page,
            });
        }
        this.fetchTableData(page, this.filterByStatus, this.filterInitiator);
    }

    public updateNow(): void {
        this.datasetCardService.handleTrigger(this.flowsData.datasetBasics, () => {
            this.refreshFlow();
            this.cdr.detectChanges();
        });
    }

    public toggleStateDatasetFlowConfigs(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        this.datasetCardService.handleToggleState({
            state: params.state,
            datasetBasics: params.datasetBasics,
            onSuccess: () => {
                this.refreshFlow();
                this.cdr.detectChanges();
            },
            confirmModal: true,
        });
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        if (filters && filters.status?.length) {
            this.selectedStatusItems = [{ id: filters.status[0], status: filters.status[0] }];
        }
        if (!filters) {
            this.searchByAccount = [];
        }
        this.searchByFilters(filters);
        this.refreshFlow();
    }

    public onResetFilters(): void {
        this.selectedDatasetItems = [];
        this.selectedAccountItems = [];
        this.selectedStatusItems = [];
    }
}
