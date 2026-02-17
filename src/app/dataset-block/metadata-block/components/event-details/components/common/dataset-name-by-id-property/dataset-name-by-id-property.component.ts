/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";

import { DatasetBasicsFragment, DatasetByIdQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetKindComponent } from "@common/components/dataset-kind/dataset-kind.component";
import { DatasetVisibilityComponent } from "@common/components/dataset-visibility/dataset-visibility.component";
import AppValues from "@common/values/app.values";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-dataset-id-and-name-property",
    templateUrl: "./dataset-name-by-id-property.component.html",
    styleUrls: ["./dataset-name-by-id-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        RouterLink,
        //-----//
        DatasetVisibilityComponent,
        DatasetKindComponent,
    ],
})
export class DatasetNameByIdPropertyComponent extends BasePropertyComponent implements OnInit {
    @Input({ required: true }) public data: string;
    public datasetBasics: DatasetBasicsFragment;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.datasetService
            .requestDatasetInfoById(this.data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((dataset: DatasetByIdQuery) => {
                if (dataset.datasets.byId) {
                    this.datasetBasics = dataset.datasets.byId;
                    this.cdr.detectChanges();
                }
            });
    }
}
