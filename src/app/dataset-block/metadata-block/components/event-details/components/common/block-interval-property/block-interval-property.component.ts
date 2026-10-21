/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { distinctUntilChanged, Subject, switchMap } from "rxjs";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-block-interval-property",
    templateUrl: "./block-interval-property.component.html",
    styleUrls: ["./block-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DisplayHashComponent],
})
export class BlockIntervalPropertyComponent extends BasePropertyComponent implements OnChanges {
    @Input({ required: true }) public data: { prevBlockHash: string; newBlockHash: string; datasetId: string };
    public datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };

    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);
    private readonly datasetIdChanges$ = new Subject<string>();

    public constructor() {
        super();
        this.datasetIdChanges$
            .pipe(
                distinctUntilChanged(),
                switchMap((datasetId: string) => this.datasetService.requestDatasetInfoById(datasetId)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((dataset: DatasetByIdQuery) => {
                if (dataset.datasets.byId) {
                    this.datasetInfo = {
                        accountName: dataset.datasets.byId.owner.accountName,
                        datasetName: dataset.datasets.byId.name,
                    };
                    this.cdr.markForCheck();
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.datasetIdChanges$.next(this.data.datasetId);
        }
    }
}
