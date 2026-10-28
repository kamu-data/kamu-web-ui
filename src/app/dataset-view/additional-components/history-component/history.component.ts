/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { Observable } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { TimelineComponent } from "@common/components/timeline-component/timeline.component";
import { positiveIntegerFromParam, queryParamValue } from "@common/helpers/url-params.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
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
export class HistoryComponent extends BaseComponent implements OnChanges {
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_PAGE, transform: queryParamValue })
    public set page(value: MaybeUndefined<string>) {
        this.currentPage = positiveIntegerFromParam(value) ?? 1;
    }

    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private currentPage = 1;
    public readonly datasetHistoryTabData$: Observable<MaybeNull<DatasetHistoryUpdate>> =
        this.datasetSubsService.historyChanges;

    public ngOnChanges(): void {
        this.requestDatasetHistory();
    }

    private requestDatasetHistory(): void {
        this.datasetService
            .requestDatasetHistory(
                { accountName: this.datasetInfo.accountName, datasetName: this.datasetInfo.datasetName },
                10,
                this.currentPage - 1,
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
