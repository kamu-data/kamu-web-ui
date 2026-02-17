/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { combineLatest, map, Observable, shareReplay, skip, Subscription, takeWhile, tap, timer } from "rxjs";

import { FlowStatus, FlowSummaryDataFragment } from "@api/kamu.graphql.interface";
import { BaseDatasetDataComponent } from "@common/components/base-dataset-data.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

import { FeatureFlagDirective } from "../../common/directives/feature-flag.directive";
import { DatasetViewHeaderComponent } from "../../dataset-view/dataset-view-header/dataset-view-header.component";
import { DatasetViewMenuComponent } from "../../dataset-view/dataset-view-menu/dataset-view-menu.component";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";

@Component({
    selector: "app-dataset-flow-details",
    templateUrl: "./dataset-flow-details.component.html",
    styleUrls: ["./dataset-flow-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        NgClass,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        //-----//
        MatIconModule,
        //-----//
        DatasetViewHeaderComponent,
        DatasetViewMenuComponent,
        FeatureFlagDirective,
    ],
})
export class DatasetFlowDetailsComponent extends BaseDatasetDataComponent implements OnInit {
    @Input(RoutingResolvers.FLOW_DETAILS_ACTIVE_TAB_KEY) public activeTab: FlowDetailsTabs;
    @Input(ProjectLinks.URL_PARAM_FLOW_ID) public flowId: string;
    @Input(RoutingResolvers.FLOW_DETAILS_KEY) public flowDetails: DatasetFlowByIdResponse;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;
    public readonly FLOWS_TYPE = DatasetViewTypeEnum.Flows;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    public datasetViewMenuData$: Observable<ViewMenuData>;
    public datasetFlowDetails$: Observable<MaybeUndefined<DatasetFlowByIdResponse>>;

    public ngOnInit(): void {
        this.loadDatasetBasicDataWithPermissions();
        this.datasetBasics$ = this.datasetService.datasetChanges.pipe(shareReplay());
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetViewMenuData$ = combineLatest([this.datasetBasics$, this.datasetPermissions$]).pipe(
            map(([datasetBasics, datasetPermissions]) => {
                return { datasetBasics, datasetPermissions };
            }),
            shareReplay(),
        );
        this.startTimer();
    }

    public getRouteLink(tab: FlowDetailsTabs): string {
        return `/${this.getDatasetInfoFromUrl().accountName}/${this.getDatasetInfoFromUrl().datasetName}/${
            ProjectLinks.URL_FLOW_DETAILS
        }/${this.flowId}/${tab}`;
    }

    private startTimer(): void {
        timer(0, 5000)
            .pipe(
                skip(1),
                takeWhile(() => this.flowDetails.flow.status !== FlowStatus.Finished),
                tap(() => {
                    this.refreshNow();
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private loadDatasetBasicDataWithPermissions(): Subscription {
        return this.datasetService
            .requestDatasetBasicDataWithPermissions(this.datasetInfo)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return FlowTableHelpers.flowTypeDescription(flow);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataFragment): string {
        return FlowTableHelpers.descriptionEndOfMessage(element);
    }

    public descriptionColumnOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        return FlowTableHelpers.descriptionColumnTableOptions(element);
    }

    public refreshNow(): void {
        this.navigationService.navigateToFlowDetails({
            ...this.datasetInfo,
            flowId: this.flowId,
            tab: this.activeTab,
        });
    }
}
