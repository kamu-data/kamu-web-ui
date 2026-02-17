/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetByIdQuery, OffsetInterval } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

@Component({
    selector: "app-interval-property",
    templateUrl: "./offset-interval-property.component.html",
    styleUrls: ["./offset-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf],
})
export class OffsetIntervalPropertyComponent extends BasePropertyComponent implements OnInit {
    @Input({ required: true }) public data: {
        block: MaybeNull<OffsetInterval>;
        datasetId: MaybeNull<string>;
    };
    private datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };
    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);

    public ngOnInit(): void {
        if (this.data.datasetId) {
            this.datasetService
                .requestDatasetInfoById(this.data.datasetId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((dataset: DatasetByIdQuery) => {
                    if (dataset.datasets.byId) {
                        this.datasetInfo.accountName = dataset.datasets.byId.owner.accountName;
                        this.datasetInfo.datasetName = dataset.datasets.byId.name;
                    }
                });
        }
    }

    public navigateToQuery(): void {
        if (!this.data.datasetId) {
            this.datasetInfo = this.getDatasetInfoFromUrl();
        }
        if (this.data.block) {
            this.navigationService.navigateToDatasetView({
                ...this.datasetInfo,
                tab: DatasetViewTypeEnum.Data,
                state: {
                    start: this.data.block.start,
                    end: this.data.block.end,
                },
            });
        }
    }
}
