/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";

import { BehaviorSubject, combineLatest, filter, map, Observable, of, switchMap, take, tap, timer } from "rxjs";

import { environment } from "@env/environment";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { trackBusy } from "@common/helpers/app.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import { SourceEventEditorLinkPipe } from "@common/pipes/source-event-editor-link.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
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
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { FlowTablePanelFiltersComponent } from "src/app/dataset-flow/flows-table/components/flow-table-panel-filters/flow-table-panel-filters.component";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FlowsTableComponent } from "src/app/dataset-flow/flows-table/flows-table.component";
import { FilterStatusType, FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { TileBaseWidgetComponent } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.component";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { FlowsAssociatedChannelsComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/flows-associated-channels.component";
import { FlowsBlockActionsComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-block-actions/flows-block-actions.component";
import {
    DatasetFlowsTabState,
    FlowsCategoryUnion,
    FlowsSelectedCategory,
    FlowsSelectionState,
    WebhooksSelectedCategory,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { FlowsSelectionStateService } from "src/app/dataset-view/additional-components/flows-component/services/flows-selection-state.service";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import ProjectLinks, { SourceEventEditor } from "src/app/project-links";
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
        RouterLink,
        //-----//
        MatProgressBarModule,
        MatChipsModule,
        //-----//
        FlowsTableComponent,
        FlowsBlockActionsComponent,
        FlowsAssociatedChannelsComponent,
        FlowTablePanelFiltersComponent,
        DatasetFlowProcessCardComponent,
        TileBaseWidgetComponent,
        PaginationComponent,
        DatasetLinkPipe,
        SourceEventEditorLinkPipe,
    ],
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit, OnChanges {
    @Input(RoutingResolvers.DATASET_VIEW_FLOWS_KEY) public flowsData: DatasetOverviewTabData;
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOK_ID) public set setWebhookId(value: MaybeNull<string>) {
        this.webhookIdParam = value;
        this.applyWebhookIdParam();
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOKS_STATE) public set setWebhookState(value: MaybeNull<string>) {
        this.webhookStateParam = value;
        this.applyWebhookStateParam();
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_FLOWS_CATEGORY) public set setFlowsCategory(value: FlowsCategoryUnion) {
        this.flowsCategoryParam = value;
        this.applyFlowsCategoryParam();
    }

    // The query parameters as last bound: the router does not bind an unchanged one again
    private webhookIdParam: MaybeNull<string> = null;
    private webhookStateParam: MaybeNull<string> = null;
    private flowsCategoryParam: FlowsCategoryUnion;

    public selectedDatasetItems: DatasetBasicsFragment[] = [];
    public selectedAccountItems: AccountFragment[] = [];
    public selectedStatusItems: FilterStatusType[] = [];
    /** The card's label shows the state from before an action until the refresh, so it stays disabled till then */
    public readonly datasetCardBusy$ = new BehaviorSubject<boolean>(false);

    private datasetWebhooksService = inject(DatasetWebhooksService);
    private flowsSelectionStateService = inject(FlowsSelectionStateService);
    private datasetCardService = inject(ProcessDatasetCardInteractionService);

    public flowsProcesses$: Observable<DatasetFlowProcesses>;

    public flowConnectionData$: Observable<DatasetFlowsTabState>;

    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SourceEventEditor: typeof SourceEventEditor = SourceEventEditor;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    public ngOnInit(): void {
        this.filterByStatus = null;
        this.refreshFlow();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const previousFlowsData = changes["flowsData"]?.previousValue as MaybeUndefined<DatasetOverviewTabData>;
        if (previousFlowsData && previousFlowsData.datasetBasics.id !== this.flowsData.datasetBasics.id) {
            this.startOverForAnotherDataset();
        }
    }

    // The router keeps this component when it moves to another dataset's Flows tab
    private startOverForAnotherDataset(): void {
        this.flowsSelectionStateService.reset();
        this.applyWebhookIdParam();
        this.applyWebhookStateParam();
        this.applyFlowsCategoryParam();
        this.filterByStatus = null;
        this.filterInitiator = null;
        this.onlySystemFlows = false;
        this.searchByAccount = [];
        this.onResetFilters();
        this.refreshFlow();
    }

    private applyWebhookIdParam(): void {
        const ids = this.webhookIdParam ? this.webhookIdParam.split(",") : [];
        ids.forEach((id: string) => this.flowsSelectionStateService.addWebhookId(id));
    }

    private applyWebhookStateParam(): void {
        const states = this.webhookStateParam ? (this.webhookStateParam.split(",") as FlowProcessEffectiveState[]) : [];
        this.flowsSelectionStateService.setWebhookFilterButtons(states);
        if (this.flowsSelectionState.webhookFilterButtons.length) {
            this.flowsSelectionStateService.setWebhooksCategory("webhooks");
        }
    }

    private applyFlowsCategoryParam(): void {
        if (this.flowsCategoryParam === "webhooks") {
            this.flowsSelectionStateService.setWebhooksCategory(this.flowsCategoryParam);
        } else {
            this.flowsSelectionStateService.setFlowsCategory(this.flowsCategoryParam);
        }
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
                    timer(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.refreshFlow();
                        });
                }
            });
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.flowsData.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    timer(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.refreshFlow();
                        });
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
            category: this.flowsSelectionState.flowsCategory,
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
        this.runDatasetCardAction(
            this.datasetCardService.handleTrigger(this.flowsData.datasetBasics).pipe(filter(Boolean)),
        );
    }

    public toggleStateDatasetFlowConfigs(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        this.runDatasetCardAction(
            this.datasetCardService.handleToggleState({
                state: params.state,
                datasetBasics: params.datasetBasics,
            }),
        );
    }

    /** `succeeded$` emits once when the action succeeded, and completes without a value otherwise */
    private runDatasetCardAction(succeeded$: Observable<unknown>): void {
        succeeded$
            .pipe(
                // Only the delayed refresh is tied to the page: the mutation still reports its result after leaving
                switchMap(() => timer(this.TIMEOUT_REFRESH_FLOW).pipe(takeUntilDestroyed(this.destroyRef))),
                trackBusy(this.datasetCardBusy$),
            )
            .subscribe(() => {
                this.refreshFlow();
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
