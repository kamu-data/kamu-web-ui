/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";

import { distinctUntilChanged, Observable, ReplaySubject, switchMap } from "rxjs";

import { BaseDatasetDataComponent } from "@common/components/base-dataset-data.component";
import { isEqual } from "@common/helpers/app.helpers";
import { enumListFromParam, positiveIntegerFromParam, queryParamValue } from "@common/helpers/url-params.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { ValidationPatterns } from "@common/validation/patterns";
import { MetadataBlocksFilter } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockHeaderComponent } from "src/app/dataset-block/metadata-block/components/block-header/block-header.component";
import { BlockNavigationComponent } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.component";
import { EventDetailsComponent } from "src/app/dataset-block/metadata-block/components/event-details/event-details.component";
import {
    SUPPORTED_EVENT_API_TYPES,
    SupportedEvents,
} from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { YamlViewSectionComponent } from "src/app/dataset-block/metadata-block/components/yaml-view-section/yaml-view-section.component";
import {
    BlockListFilter,
    BlockListRequest,
    BlockView,
    MetadataBlockInfo,
} from "src/app/dataset-block/metadata-block/metadata-block.types";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        //-----//
        MatSlideToggleModule,
        //-----//
        BlockHeaderComponent,
        BlockNavigationComponent,
        DatasetViewHeaderComponent,
        DatasetViewMenuComponent,
        EventDetailsComponent,
        YamlViewSectionComponent,
    ],
})
export class MetadataBlockComponent extends BaseDatasetDataComponent implements OnInit, OnChanges {
    @Input(ProjectLinks.URL_PARAM_BLOCK_HASH) public blockHash: string;
    @Input(RoutingResolvers.METADATA_BLOCK_KEY) public metadata: MetadataBlockInfo;
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_PAGE, transform: queryParamValue })
    public set page(value: MaybeUndefined<string>) {
        this.blockListPage = positiveIntegerFromParam(value) ?? 1;
    }
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_EVENT_TYPES, transform: queryParamValue })
    public set eventTypes(value: MaybeUndefined<string>) {
        this.blockListFilter = { ...this.blockListFilter, eventTypes: enumListFromParam(SupportedEvents, value) };
    }
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_HASH_PREFIX, transform: queryParamValue })
    public set hashPrefix(value: MaybeUndefined<string>) {
        this.blockListFilter = { ...this.blockListFilter, hashPrefix: value ?? "" };
    }

    private static readonly BLOCKS_PER_PAGE = 10;
    public readonly HISTORY_TYPE = DatasetViewTypeEnum.History;
    public readonly BlockView: typeof BlockView = BlockView;

    public readonly datasetInfo$: Observable<DatasetInfo> = this.datasetInfoFromUrlChanges;
    private readonly historyRequest$ = new ReplaySubject<BlockListRequest>(1);
    public readonly datasetHistoryUpdate$: Observable<DatasetHistoryUpdate> = this.historyRequest$.pipe(
        distinctUntilChanged<BlockListRequest>(isEqual),
        // A newer page or filter cancels the request still running, so its result can't replace the newer one
        switchMap(({ page, filter }) =>
            this.datasetService.getDatasetHistory(
                this.getDatasetInfoFromUrl(),
                MetadataBlockComponent.BLOCKS_PER_PAGE,
                page,
                filter,
            ),
        ),
    );

    public blockView: BlockView = BlockView.PROPERTIES;
    public blockListFilter: BlockListFilter = { eventTypes: [], hashPrefix: "" };
    private blockListPage = 1;

    public ngOnChanges(): void {
        this.historyRequest$.next({
            page: this.blockListPage - 1,
            filter: MetadataBlockComponent.apiFilter(this.blockListFilter),
        });
    }

    public ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges;
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.loadDatasetBasicDataWithPermissions();
    }

    public onPageChange(page: number): void {
        this.navigateToBlockList(this.blockListFilter, page);
    }

    public onFilterChange(filter: BlockListFilter): void {
        this.navigateToBlockList(filter, 1);
    }

    public toggleYamlView(event: MatSlideToggleChange): void {
        this.blockView = event.checked ? BlockView.YAML : BlockView.PROPERTIES;
    }

    private navigateToBlockList(blockListFilter: BlockListFilter, blockListPage: number): void {
        this.navigationService.navigateToMetadataBlock({
            ...this.getDatasetInfoFromUrl(),
            blockHash: this.blockHash,
            blockListFilter,
            blockListPage,
        });
    }

    private loadDatasetBasicDataWithPermissions(): void {
        this.datasetService
            .requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private static apiFilter(filter: BlockListFilter): MetadataBlocksFilter {
        const hashPrefix = filter.hashPrefix.trim();
        // The backend fails the whole query on a malformed prefix; the sidebar says what is wrong with it instead
        const validPrefix = hashPrefix !== "" && ValidationPatterns.BLOCK_HASH_PREFIX.regex.test(hashPrefix);
        return {
            ...(filter.eventTypes.length
                ? { eventTypes: filter.eventTypes.map((type) => SUPPORTED_EVENT_API_TYPES[type]) }
                : {}),
            ...(validPrefix ? { blockHashPrefix: hashPrefix } : {}),
        };
    }
}
