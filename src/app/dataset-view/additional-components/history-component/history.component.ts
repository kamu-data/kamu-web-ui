/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";

import { filter, Observable } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { TimelineComponent } from "@common/components/timeline-component/timeline.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        //-----//
        TimelineComponent,
        PaginationComponent,
        PagePastEndComponent,
    ],
})
export class HistoryComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public datasetHistoryTabData$: Observable<MaybeNull<DatasetHistoryUpdate>>;
    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);
    private router = inject(Router);
    private datasetSubsService = inject(DatasetSubscriptionsService);

    public ngOnInit(): void {
        this.requestDatasetHistory();
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.requestDatasetHistory();
            });
        this.datasetHistoryTabData$ = this.datasetSubsService.historyChanges;
    }

    private requestDatasetHistory(): void {
        this.datasetService
            .requestDatasetHistory(
                { accountName: this.datasetInfo.accountName, datasetName: this.datasetInfo.datasetName },
                10,
                (this.pageFromUrl() ?? 1) - 1,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public onPageChange(page: number): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetInfo.accountName,
            datasetName: this.datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.History,
            page,
        });
    }
}
