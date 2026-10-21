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

import { distinctUntilChanged, filter, Subject, switchMap, tap } from "rxjs";

import { DatasetByIdQuery, OffsetInterval } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-interval-property",
    templateUrl: "./offset-interval-property.component.html",
    styleUrls: ["./offset-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetIntervalPropertyComponent extends BasePropertyComponent implements OnChanges {
    @Input({ required: true }) public data: {
        block: MaybeNull<OffsetInterval>;
        datasetId: MaybeNull<string>;
    };
    private datasetInfo: MaybeNull<DatasetInfo> = null;
    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);

    private readonly datasetIdChanges$ = new Subject<MaybeNull<string>>();

    public constructor() {
        super();
        this.datasetIdChanges$
            .pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.datasetInfo = null;
                    this.cdr.markForCheck();
                }),
                filter((datasetId: MaybeNull<string>): datasetId is string => datasetId !== null),
                switchMap((datasetId: string) => this.datasetService.requestDatasetInfoById(datasetId)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((dataset: DatasetByIdQuery) => {
                const byId = dataset.datasets.byId;
                this.datasetInfo = byId ? { accountName: byId.owner.accountName, datasetName: byId.name } : null;
                this.cdr.markForCheck();
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.datasetIdChanges$.next(this.data.datasetId);
        }
    }

    public get isQueryTargetKnown(): boolean {
        return !this.data.datasetId || this.datasetInfo !== null;
    }

    public navigateToQuery(): void {
        const target = this.data.datasetId ? this.datasetInfo : this.getDatasetInfoFromUrl();
        if (this.data.block && target) {
            this.navigationService.navigateToDatasetView({
                ...target,
                tab: DatasetViewTypeEnum.Data,
                state: {
                    start: this.data.block.start,
                    end: this.data.block.end,
                },
            });
        }
    }
}
