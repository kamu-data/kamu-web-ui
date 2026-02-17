/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-block-interval-property",
    templateUrl: "./block-interval-property.component.html",
    styleUrls: ["./block-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DisplayHashComponent],
})
export class BlockIntervalPropertyComponent extends BasePropertyComponent implements OnInit {
    @Input({ required: true }) public data: { prevBlockHash: string; newBlockHash: string; datasetId: string };
    public datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };

    private datasetService = inject(DatasetService);

    public ngOnInit(): void {
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
