/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetHistoryUpdate } from "../../dataset.subscriptions.interface";
import { MaybeNull } from "src/app/interface/app.types";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { DatasetService } from "../../dataset.service";
import { filter, Observable } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { TimelineComponent } from "../../../common/components/timeline-component/timeline.component";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        //-----//
        TimelineComponent,
        PaginationComponent,
    ]
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
                this.getPageFromRoute() - 1,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private getPageFromRoute(): number {
        const currentPage = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        return currentPage ? Number(currentPage) : 1;
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
