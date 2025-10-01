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
    FlowTriggerStopPolicy,
    FlowTriggerStopPolicyAfterConsecutiveFailures,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { combineLatest, map, Observable, Subject, switchMap, take, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import {
    DatasetOverviewTabData,
    DatasetViewTypeEnum,
    FlowsSelectedCategory,
    WEBHOOKS_FILTERS_ITEMS,
    WebhooksFiltersDescriptor,
    WebhooksSelectedCategory,
    webhooksStateMapper,
} from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { FlowsTableComponent } from "../../../dataset-flow/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../../../dataset-flow/tile-base-widget/tile-base-widget.component";
import { RouterLink } from "@angular/router";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NgIf, AsyncPipe, DatePipe, NgFor, NgClass } from "@angular/common";
import AppValues from "src/app/common/values/app.values";
import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { SubprocessStatusFilterPipe } from "./pipes/subprocess-status-filter.pipe";
import { DatasetWebhooksService } from "../dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { MatChipsModule } from "@angular/material/chips";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        DatePipe,
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
        TileBaseWidgetComponent,
        PaginationComponent,
        SubprocessStatusFilterPipe,
    ],
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_FLOWS_KEY) public flowsData: DatasetOverviewTabData;
    @Input(ProjectLinks.URL_QUERY_PARAM_WEBHOOK_ID) public webhookId: MaybeUndefined<string>;

    public searchFilter = "";
    private datasetWebhooksService = inject(DatasetWebhooksService);

    public flowsProcesses$: Observable<DatasetFlowProcesses>;
    public selectedFlowsCategory: MaybeNull<FlowsSelectedCategory> = "ALL";
    public selectedWebhooksCategory: MaybeNull<WebhooksSelectedCategory> = null;
    public selectedWebhookFilterButton: MaybeNull<FlowProcessEffectiveState> = null;
    private stopFetchingTableData$ = new Subject<void>();
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly FlowProcessAutoStopReason: typeof FlowProcessAutoStopReason = FlowProcessAutoStopReason;

    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly DatasetFlowType: typeof DatasetFlowType = DatasetFlowType;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];
    public readonly WEBHOOKS_FILTERS_OPTIONS: WebhooksFiltersDescriptor[] = WEBHOOKS_FILTERS_ITEMS;

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    public get showSubprocessesTable(): boolean {
        return this.selectedWebhooksCategory === "WEBHOOKS" || Boolean(this.webhookId);
    }

    public setWebhookFilterButton(value: MaybeNull<FlowProcessEffectiveState>) {
        this.selectedWebhookFilterButton = value;
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.flowsData.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public maxFailures(policy: FlowTriggerStopPolicy): number {
        return (policy as FlowTriggerStopPolicyAfterConsecutiveFailures).maxFailures;
    }

    public navigatoToSubscription(subscriptionId: string): void {
        this.stopFetchingTableData$.next();
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: subscriptionId,
        });
        this.fetchTableData(this.currentPage);
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
                    }, this.TIMEOUT_REFRESH_FLOW);
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
                    }, this.TIMEOUT_REFRESH_FLOW);
                }
            });
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
                        datasetId: this.flowsData.datasetBasics.id,
                        page: page - 1,
                        perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                        perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: {
                            byStatus: filterByStatus,
                            byInitiator: filterByInitiator,
                            byProcessType: this.setProcessTypeFilter(
                                this.webhookId,
                                this.selectedFlowsCategory,
                                this.selectedWebhooksCategory,
                            ),
                        },
                    }),
                    this.flowsService.allFlowsPaused(this.flowsData.datasetBasics.id),
                    this.flowsService.flowsInitiators(this.flowsData.datasetBasics.id),
                    this.flowsService.datasetFlowsProcesses({ datasetId: this.flowsData.datasetBasics.id }),
                ]),
            ),

            map(([flowsData, allFlowsPaused, flowInitiators, flowsProcesses]) => {
                return { flowsData, allFlowsPaused, flowInitiators, flowsProcesses };
            }),
        );
    }

    private setProcessTypeFilter(
        webhookId: MaybeUndefined<string>,
        datasetFlowFilter: MaybeNull<FlowsSelectedCategory>,
        webhooksFilter: MaybeNull<WebhooksSelectedCategory>,
    ): MaybeNull<FlowProcessTypeFilterInput> {
        if (webhookId) {
            this.selectedFlowsCategory = null;
            this.selectedWebhooksCategory = null;
            return {
                primary: undefined,
                webhooks: { subscriptionIds: [webhookId] },
            };
        }
        if (webhooksFilter === "WEBHOOKS") {
            return {
                primary: undefined,
                webhooks: { subscriptionIds: [] },
            };
        }
        if (datasetFlowFilter === "UPDATES_ONLY") {
            return {
                primary: { byFlowTypes: [this.isRoot ? DatasetFlowType.Ingest : DatasetFlowType.ExecuteTransform] },
                webhooks: undefined,
            };
        }
        return null;
    }

    public onSelectionFlowsChange(): void {
        this.selectedWebhooksCategory = null;
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
        });
        this.refreshFlow();
    }

    public onSelectionWebhooksChange(): void {
        this.selectedFlowsCategory = null;
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
        });
        this.refreshFlow();
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
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

    public toggleStateDatasetFlowConfigs(paused: boolean): void {
        const operation$ = paused
            ? this.flowsService.datasetResumeFlows({
                  datasetId: this.flowsData.datasetBasics.id,
              })
            : this.flowsService.datasetPauseFlows({
                  datasetId: this.flowsData.datasetBasics.id,
              });

        operation$.pipe(take(1)).subscribe(() => {
            setTimeout(() => {
                this.refreshFlow();
                this.cdr.detectChanges();
            }, this.TIMEOUT_REFRESH_FLOW);
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
}
