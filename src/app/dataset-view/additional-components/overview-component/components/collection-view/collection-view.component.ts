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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router, RouterLink } from "@angular/router";

import { BehaviorSubject, filter, finalize, map, Observable, switchMap } from "rxjs";

import { InfiniteScrollDirective } from "ngx-infinite-scroll";

import {
    CollectionEntryConnection,
    CollectionEntryDataFragment,
    DatasetBasicsFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetAsCollectionService } from "../../services/dataset-as-collection.service";
import { getCollectionValueHelper, getFileIconHelper, sortCollectionEntryData } from "./collection-view.helper";
import { CollectionEntryViewType, LoadCollectionDataParams } from "./collection-view.model";

@Component({
    selector: "app-collection-view",
    imports: [
        AsyncPipe,
        NgIf,
        NgFor,
        RouterLink,
        //-----//
        InfiniteScrollDirective,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatProgressSpinnerModule,

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
    public loadingOnScroll$: Observable<boolean>;
    private loadCollectionDataSubject$ = new BehaviorSubject<MaybeNull<LoadCollectionDataParams>>(null);

    public currentPage: number = 1;
    public pathPrefix = "/";
    public maxDepth = 0;
    public isAllDataLoaded = false;
    public readonly perPage: number = 20;

    public displayedColumns: string[] = ["name"];
    public extraDataKeys: string[] = [];

    private datasetAsCollectionService = inject(DatasetAsCollectionService);
    private router = inject(Router);

    public ngOnInit(): void {
        this.loadingCollection$ = this.datasetAsCollectionService.loadingCollectionChanges;
        this.loadingOnScroll$ = this.datasetAsCollectionService.loadingOnScrollChanges;
    }

    public get loadCollectionData$(): Observable<{ path: string; page: number } | null> {
        return this.loadCollectionDataSubject$.asObservable();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasetBasics && changes.datasetBasics.previousValue !== changes.datasetBasics.currentValue) {
            this.currentPage = 1;
            this.datasetAsCollectionService.emitLoadingCollectionChanged(true);
            this.loadCollectionDataSubject$.next({ path: this.pathPrefix, page: this.currentPage });
            this.loadDatasetAsCollection();
        }
    }

    public onScroll(): void {
        if (this.isAllDataLoaded) {
            return;
        }
        this.currentPage++;
        this.datasetAsCollectionService.emitLoadingOnScrollChanged(true);
        this.loadCollectionDataSubject$.next({ path: this.pathPrefix, page: this.currentPage });
    }

    private loadDatasetAsCollection(): void {
        this.collectionInfo$ = this.loadCollectionData$.pipe(
            filter((params) => params !== null),
            switchMap((params) =>
                this.datasetAsCollectionService
                    .requestDatasetAsCollection({
                        datasetId: this.datasetBasics.id,
                        pathPrefix: params.path,
                        page: params.page - 1,
                        perPage: this.perPage,
                    })
                    .pipe(
                        map((result) => {
                            this.isAllDataLoaded = !result.pageInfo.hasNextPage;
                            const nodes = sortCollectionEntryData(result.nodes, this.maxDepth);
                            this.extraDataKeys =
                                nodes.length > 0
                                    ? Object.keys(sortCollectionEntryData(result.nodes, this.maxDepth)[0].extraData)
                                    : [];
                            if (this.displayedColumns.length === 1) {
                                this.displayedColumns = [...this.displayedColumns, ...this.extraDataKeys];
                            }

                            this.dataSource.data = [...this.dataSource.data, ...nodes];
                            return result;
                        }),
                        finalize(() => {
                            this.datasetAsCollectionService.emitLoadingCollectionChanged(false);
                            this.datasetAsCollectionService.emitLoadingOnScrollChanged(false);
                        }),
                    ),
            ),
        );
    }

    public displayNodes(nodes: CollectionEntryDataFragment[]): CollectionEntryViewType[] {
        return sortCollectionEntryData(nodes, this.maxDepth);
    }

    public getValue(value: unknown): string {
        return getCollectionValueHelper(value);
    }

    public getFileIconHelper(contentType: string): string {
        return getFileIconHelper(contentType);
    }

    public clickTableRow(row: CollectionEntryViewType): void {
        if (row.isFolder) {
            this.pathPrefix += `${this.maxDepth === 0 ? row.displayName : "/" + row.displayName}`;
            this.maxDepth += 1;
            this.currentPage = 1;
            this.dataSource.data = [];
            this.datasetAsCollectionService.emitLoadingCollectionChanged(true);
            this.loadCollectionDataSubject$.next({ path: this.pathPrefix, page: this.currentPage });
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
        this.currentPage = 1;
        this.dataSource.data = [];
        this.datasetAsCollectionService.emitLoadingCollectionChanged(true);
        this.loadCollectionDataSubject$.next({ path: this.pathPrefix, page: this.currentPage });
    }
}
