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
import { RouterLink } from "@angular/router";

import { Subject } from "rxjs";

import { DatasetKindComponent } from "@common/components/dataset-kind/dataset-kind.component";
import { DatasetVisibilityComponent } from "@common/components/dataset-visibility/dataset-visibility.component";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { datasetByIdChanges } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-dataset-id-and-name-property",
    templateUrl: "./dataset-name-by-id-property.component.html",
    styleUrls: ["./dataset-name-by-id-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterLink,
        //-----//
        DatasetVisibilityComponent,
        DatasetKindComponent,
        DatasetLinkPipe,
    ],
})
export class DatasetNameByIdPropertyComponent extends BasePropertyComponent implements OnChanges {
    @Input({ required: true }) public data: string;

    public datasetBasics: MaybeUndefined<DatasetBasicsFragment>;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);

    private readonly datasetIdChanges$ = new Subject<string>();

    public static acceptsData(data: unknown): data is DatasetNameByIdPropertyComponent["data"] {
        return typeof data === "string";
    }

    public constructor() {
        super();
        datasetByIdChanges(this.datasetIdChanges$, (datasetId: string) =>
            this.datasetService.requestDatasetInfoById(datasetId),
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((datasetBasics: MaybeNull<DatasetBasicsFragment>) => {
                this.datasetBasics = datasetBasics ?? undefined;
                this.cdr.markForCheck();
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.datasetIdChanges$.next(this.data);
        }
    }
}
