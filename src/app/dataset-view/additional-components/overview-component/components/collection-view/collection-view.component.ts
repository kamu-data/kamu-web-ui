/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Clipboard } from "@angular/cdk/clipboard";
import { AsyncPipe, DatePipe, NgFor, NgIf, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";

import { buffer, debounceTime, map, Observable, Subject, tap } from "rxjs";

import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { ToastrService } from "ngx-toastr";

import { UnsubscribeDestroyRefAdapter } from "@common/components/unsubscribe.ondestroy.adapter";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import AppValues from "@common/values/app.values";
import {
    CollectionEntry,
    CollectionEntryConnection,
    CollectionEntryDataFragment,
    DatasetArchetype,
    DatasetBasicsFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetService } from "src/app/dataset-view/dataset.service";

import { DatasetAsCollectionService } from "../../services/dataset-as-collection.service";
import { PreviewFileTypePipe } from "../versioned-file-view/pipes/preview-file-type.pipe";
import { getCollectionValueHelper, sortCollectionEntryData } from "./collection-view.helper";
import { CollectionEntriesResult, CollectionEntryViewType } from "./collection-view.model";

@Component({
    selector: "app-collection-view",
    imports: [
        //-----//
        AsyncPipe,
        DatePipe,
        NgIf,
        NgFor,
        SlicePipe,

        //-----//
        InfiniteScrollDirective,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatProgressSpinnerModule,

        //-----//
        DisplaySizePipe,
        DisplayDatasetIdPipe,
        PreviewFileTypePipe,
    ],
    templateUrl: "./collection-view.component.html",
    styleUrl: "./collection-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent extends UnsubscribeDestroyRefAdapter implements OnChanges, OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public dataSource = new MatTableDataSource<CollectionEntryViewType>();
    public collectionInfo$: Observable<CollectionEntriesResult>;
    public loadingCollection$: Observable<boolean>;
    public loadingOnScroll$: Observable<boolean>;
    private click$ = new Subject<string>();

    public currentPage: number = 1;
    public pathPrefix: string = "/";
    public maxDepth: number = 0;
    public entriesTotalCount: number;
    public isAllDataLoaded: boolean = false;
    public selectedRow: CollectionEntryViewType | null = null;
    public readonly perPage: number = 20;
    public readonly INITIAL_DISPLAYED_COLUMNS: string[] = ["name", "systemTime", "owner", "hash", "size"];
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DatasetArchetype: typeof DatasetArchetype = DatasetArchetype;

    public displayedColumns: string[] = [];
    public extraDataKeys: string[] = [];

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    private datasetAsCollectionService = inject(DatasetAsCollectionService);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    private clipboard = inject(Clipboard);
    private datasetService = inject(DatasetService);

    public ngOnInit(): void {
        this.loadingCollection$ = this.datasetAsCollectionService.loadingCollectionChanges;
        this.loadingOnScroll$ = this.datasetAsCollectionService.loadingOnScrollChanges;
        this.initClickListeners();
    }

    private initClickListeners(): void {
        this.click$
            .pipe(
                buffer(this.click$.pipe(debounceTime(250))),
                map((clicks: string[]) => ({
                    count: clicks.length,
                    text: clicks[0], // Take the text from the first click
                })),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(({ count, text }) => {
                if (count === 1) {
                    this.clipboard.copy(text);
                    this.toastr.success(`Copied`, "", { timeOut: 1000 });
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasetBasics && changes.datasetBasics.previousValue !== changes.datasetBasics.currentValue) {
            this.resetTableView();
            this.triggerLoadCollection(false);
            this.loadDatasetAsCollection();
        }
    }

    public onScroll(): void {
        if (this.isAllDataLoaded) {
            return;
        }
        this.currentPage++;
        this.datasetAsCollectionService.emitLoadingOnScrollChanged(true);
        this.datasetAsCollectionService.loadCollectionDataChange({
            path: this.pathPrefix,
            page: this.currentPage,
            headChanged: false,
        });
    }

    private loadDatasetAsCollection(): void {
        this.collectionInfo$ = this.datasetAsCollectionService
            .loadCollectionInfo(this.datasetBasics.id, this.perPage)
            .pipe(
                map(({ connection, headChanged }) => {
                    if (headChanged || this.pathPrefix === "/") {
                        this.entriesTotalCount = connection.totalCount;
                    }
                    this.isAllDataLoaded = !connection.pageInfo.hasNextPage;
                    const nodes = sortCollectionEntryData(connection.nodes, this.maxDepth);
                    this.prepareDisplayColumns(connection.nodes);
                    if (connection.totalCount !== this.dataSource.data.length) {
                        this.datasetAsCollectionService.cashEntries.set(this.pathPrefix, [
                            ...this.dataSource.data,
                            ...nodes,
                        ]);
                    }
                    this.dataSource.data = [...this.dataSource.data, ...nodes];
                    return {
                        connection,
                        headChanged,
                    };
                }),
            );
    }

    private prepareDisplayColumns(nodes: CollectionEntry[]): void {
        this.extraDataKeys =
            nodes.length > 0 ? Object.keys(sortCollectionEntryData(nodes, this.maxDepth)[0].extraData) : [];

        if (this.displayedColumns.length) {
            this.displayedColumns = [...this.INITIAL_DISPLAYED_COLUMNS, ...this.extraDataKeys];
        }
        if (this.extraDataKeys.includes("content_length")) {
            const filteredColumns = this.displayedColumns.filter((item) => item !== "hash" && item !== "size");
            this.displayedColumns = filteredColumns;
        }
    }

    public displayNodes(nodes: CollectionEntryDataFragment[]): CollectionEntryViewType[] {
        return sortCollectionEntryData(nodes, this.maxDepth);
    }

    public getValue(value: unknown): string {
        return getCollectionValueHelper(value);
    }

    public isRowSelected(row: CollectionEntryViewType): boolean {
        return this.selectedRow === row;
    }

    public dbClickTableRow(row: CollectionEntryViewType): void {
        if (row.archetype === DatasetArchetype.Collection) {
            this.pathPrefix += `${this.maxDepth === 0 ? row.displayName : "/" + row.displayName}`;
            this.maxDepth += 1;
            this.currentPage = 1;
            this.dataSource.data = [];
            this.checkHeadAndLoadCollection();
        } else {
            if (row.asDataset) {
                const urlTree = this.router.createUrlTree([row.asDataset?.alias]);
                const url = this.router.serializeUrl(urlTree);
                window.open(url, "_blank");
            }
        }
    }

    public clickTableRow(row: CollectionEntryViewType): void {
        this.selectedRow = row;
    }

    public goUp(): void {
        const lastSlashIndex = this.pathPrefix.lastIndexOf("/");
        this.pathPrefix = lastSlashIndex === 0 ? "/" : this.pathPrefix.substring(0, lastSlashIndex);
        this.maxDepth -= 1;
        this.currentPage = 1;
        this.dataSource.data = [];
        this.checkHeadAndLoadCollection();
    }

    public onCellEventClick(value: string, archetype: MaybeNull<DatasetArchetype>) {
        if (archetype !== DatasetArchetype.Collection) {
            this.click$.next(value);
        }
    }

    private triggerLoadCollection(headChanged: boolean): void {
        this.datasetAsCollectionService.emitLoadingCollectionChanged(true);
        this.datasetAsCollectionService.loadCollectionDataChange({
            path: this.pathPrefix,
            page: this.currentPage,
            headChanged,
        });
    }

    private resetTableView(): void {
        this.currentPage = 1;
        this.dataSource.data = [];
        this.displayedColumns = this.INITIAL_DISPLAYED_COLUMNS;
    }

    private checkHeadAndLoadCollection(): void {
        this.datasetAsCollectionService.emitLoadingCollectionChanged(true);
        this.datasetService
            .isHeadHashBlockChanged(this.datasetBasics)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((headChanged) => {
                if (headChanged) {
                    this.datasetAsCollectionService.cashEntries.clear();
                    this.isAllDataLoaded = false;
                }
                const casheKeyExist = this.datasetAsCollectionService.cashEntries.has(this.pathPrefix);
                if (casheKeyExist) {
                    this.dataSource.data = this.datasetAsCollectionService.cashEntries.get(
                        this.pathPrefix,
                    ) as CollectionEntryViewType[];
                    this.datasetAsCollectionService.emitLoadingCollectionChanged(false);
                } else {
                    this.triggerLoadCollection(headChanged);
                }
            });
    }
}
