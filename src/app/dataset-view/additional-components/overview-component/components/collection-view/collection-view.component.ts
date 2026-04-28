/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AsyncPipe,
    JsonPipe,
    NgComponentOutlet,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
} from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { Observable } from "rxjs";

import {
    CollectionEntryConnection,
    CollectionEntryDataFragment,
    DatasetBasicsFragment,
} from "@api/kamu.graphql.interface";

import { DatasetAsCollectionService } from "../../services/dataset-as-collection.service";
import { sortCollectionEntryData } from "./collection-view.helper";
import { CollectionEntryViewType } from "./collection-view.model";

@Component({
    selector: "app-collection-view",
    imports: [
        AsyncPipe,
        NgIf,
        NgFor,
        JsonPipe,
        //-----//
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,

        //-----//
    ],
    templateUrl: "./collection-view.component.html",
    styleUrl: "./collection-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent implements OnChanges {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public collectionInfo$: Observable<CollectionEntryConnection>;
    public currentPage: number = 0;
    public readonly perPage: number = 50;

    private datasetAsCollectionService = inject(DatasetAsCollectionService);

    public ngOnChanges(changes: SimpleChanges): void {
        this.loadDatasetAsCollection();
    }

    private loadDatasetAsCollection(): void {
        this.collectionInfo$ = this.datasetAsCollectionService.requestDatasetAsCollection({
            datasetId: this.datasetBasics.id,
            pathPrefix: "/",
            page: this.currentPage,
            perPage: this.perPage,
        });
    }

    public displayNodes(nodes: CollectionEntryDataFragment[]): CollectionEntryViewType[] {
        return sortCollectionEntryData(nodes);
    }
}
