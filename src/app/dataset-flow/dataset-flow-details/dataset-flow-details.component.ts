/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowStatus } from "./../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { DatasetFlowByIdResponse, FlowDetailsTabs, ViewMenuData } from "./dataset-flow-details.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { Observable, Subscription, combineLatest, map, shareReplay, switchMap, takeWhile, tap, timer } from "rxjs";
import { FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { BaseDatasetDataComponent } from "src/app/common/components/base-dataset-data.component";
import { DatasetFlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-dataset-flow-details",
    templateUrl: "./dataset-flow-details.component.html",
    styleUrls: ["./dataset-flow-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetFlowDetailsComponent extends BaseDatasetDataComponent implements OnInit {
    @Input(ProjectLinks.URL_PARAM_CATEGORY) public set category(value: MaybeUndefined<FlowDetailsTabs>) {
        this.activeTab = value && Object.values(FlowDetailsTabs).includes(value) ? value : FlowDetailsTabs.SUMMARY;
    }
    @Input(ProjectLinks.URL_PARAM_FLOW_ID) public set id(value: string) {
        this.flowId = value;
    }
    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;
    public readonly FLOWS_TYPE = DatasetViewTypeEnum.Flows;
    public activeTab: FlowDetailsTabs;
    public flowId = "";
    public datasetViewMenuData$: Observable<ViewMenuData>;
    public datasetFlowDetails$: Observable<MaybeUndefined<DatasetFlowByIdResponse>>;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    private datasetFlowsService = inject(DatasetFlowsService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges.pipe(shareReplay());
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetViewMenuData$ = combineLatest([this.datasetBasics$, this.datasetPermissions$]).pipe(
            map(([datasetBasics, datasetPermissions]) => {
                return { datasetBasics, datasetPermissions };
            }),
            shareReplay(),
        );

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
