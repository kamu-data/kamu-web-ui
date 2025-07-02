/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { Observable, Subscription, combineLatest, map, shareReplay, skip, takeWhile, tap, timer } from "rxjs";
import { FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { BaseDatasetDataComponent } from "src/app/common/components/base-dataset-data.component";
import { DatasetFlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";
import { FeatureFlagDirective } from "../../common/directives/feature-flag.directive";
import { MatIconModule } from "@angular/material/icon";
import { DatasetViewMenuComponent } from "../../dataset-view/dataset-view-menu/dataset-view-menu.component";
import { DatasetViewHeaderComponent } from "../../dataset-view/dataset-view-header/dataset-view-header.component";
import { NgIf, NgClass, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-dataset-flow-details",
    templateUrl: "./dataset-flow-details.component.html",
    styleUrls: ["./dataset-flow-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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

    public datasetViewMenuData$: Observable<ViewMenuData>;
    public datasetFlowDetails$: Observable<MaybeUndefined<DatasetFlowByIdResponse>>;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

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
        return DataHelpers.flowTypeDescription(flow);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.descriptionEndOfMessage(element);
    }

    public descriptionColumnOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        return DatasetFlowTableHelpers.descriptionColumnTableOptions(element);
    }

    public refreshNow(): void {
        this.navigationService.navigateToFlowDetails({
            ...this.datasetInfo,
            flowId: this.flowId,
            tab: this.activeTab,
        });
    }
}
