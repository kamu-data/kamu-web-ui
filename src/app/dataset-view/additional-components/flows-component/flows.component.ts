/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetOverviewFragment,
    FlowStatus,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { combineLatest, map, switchMap, timer } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public searchFilter = "";
    public overview: DatasetOverviewFragment;
    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;

    private datasetSubsService = inject(DatasetSubscriptionsService);

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
        this.datasetSubsService.overviewChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            });
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
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
                        perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                        perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: { byStatus: filterByStatus, byInitiator: filterByInitiator },
                    }),
                    this.flowsService.allFlowsPaused(this.datasetBasics.id),
                    this.flowsService.flowsInitiators(this.datasetBasics.id),
                ]),
            ),
            map(([flowsData, allFlowsPaused, flowInitiators]) => {
                return { flowsData, allFlowsPaused, flowInitiators };
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

    public updateNow(): void {
        this.flowsService
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
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, this.TIMEOUT_REFRESH_FLOW);
                }
            });
    }

    public toggleStateDatasetFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.flowsService
                .datasetPauseFlows({
                    datasetId: this.datasetBasics.id,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        } else {
            this.flowsService
                .datasetResumeFlows({
                    datasetId: this.datasetBasics.id,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
        setTimeout(() => {
            this.refreshFlow();
            this.cdr.detectChanges();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        if (!filters) {
            this.searchByAccount = [];
        }
        this.searchByFilters(filters);
    }
}
