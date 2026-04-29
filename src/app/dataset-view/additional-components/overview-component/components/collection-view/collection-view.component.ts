/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router, RouterLink } from "@angular/router";

import { Observable, tap } from "rxjs";

import {
    CollectionEntryConnection,
    CollectionEntryDataFragment,
    DatasetBasicsFragment,
} from "@api/kamu.graphql.interface";

import { DatasetAsCollectionService } from "../../services/dataset-as-collection.service";
import { getFileIconHelper, sortCollectionEntryData } from "./collection-view.helper";
import { CollectionEntryViewType } from "./collection-view.model";

@Component({
    selector: "app-collection-view",
    imports: [
        AsyncPipe,
        NgIf,
        NgFor,
        RouterLink,
        //-----//
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,

        //-----//
    ],
    templateUrl: "./collection-view.component.html",
    styleUrl: "./collection-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent implements OnChanges, OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public dataSource = new MatTableDataSource<CollectionEntryViewType>();
    public collectionInfo$: Observable<CollectionEntryConnection>;
    public loadingCollection$: Observable<boolean>;
    public currentPage: number = 1;
    public pathPrefix = "/";
    public maxDepth = 0;
    public readonly perPage: number = 50;

    public displayedColumns: string[] = ["name"];
    public extraDataKeys: string[] = [];

    private datasetAsCollectionService = inject(DatasetAsCollectionService);
    private router = inject(Router);

    public ngOnInit(): void {
        this.loadingCollection$ = this.datasetAsCollectionService.loadingCollectionChanges;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasetBasics && changes.datasetBasics.previousValue !== changes.datasetBasics.currentValue) {
            this.loadDatasetAsCollection(this.pathPrefix);
        }
    }

    private loadDatasetAsCollection(pathPrefix: string): void {
        this.collectionInfo$ = this.datasetAsCollectionService
            .requestDatasetAsCollection({
                datasetId: this.datasetBasics.id,
                pathPrefix: pathPrefix,
                page: this.currentPage - 1,
                perPage: this.perPage,
            })
            .pipe(
                tap((result) => {
                    const nodes = sortCollectionEntryData(result.nodes, this.maxDepth);
                    this.extraDataKeys =
                        nodes.length > 0
                            ? Object.keys(sortCollectionEntryData(result.nodes, this.maxDepth)[0].extraData)
                            : [];
                    if (this.displayedColumns.length === 1) {
                        this.displayedColumns = [...this.displayedColumns, ...this.extraDataKeys];
                    }
                    this.dataSource.data = nodes;
                }),
            );
    }

    public displayNodes(nodes: CollectionEntryDataFragment[]): CollectionEntryViewType[] {
        return sortCollectionEntryData(nodes, this.maxDepth);
    }

    public getValue(value: unknown): string {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(", ") : "-";
        }

        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value as string;
    }

    public getFileIconHelper(contentType: string): string {
        return getFileIconHelper(contentType);
    }

    public clickTableRow(row: CollectionEntryViewType): void {
        if (row.isFolder) {
            this.pathPrefix += `${this.maxDepth === 0 ? row.displayName : "/" + row.displayName}`;
            this.maxDepth += 1;
            this.loadDatasetAsCollection(this.pathPrefix);
        } else {
            const urlTree = this.router.createUrlTree([row.asDataset?.alias]);
            const url = this.router.serializeUrl(urlTree);
            window.open(url, "_blank");
        }
    }

    public goUp(): void {
        const lastSlashIndex = this.pathPrefix.lastIndexOf("/");
        this.pathPrefix = lastSlashIndex === 0 ? "/" : this.pathPrefix.substring(0, lastSlashIndex);
        this.maxDepth -= 1;
        this.loadDatasetAsCollection(this.pathPrefix);
    }
}
