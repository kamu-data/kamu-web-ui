/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";

import { Observable } from "rxjs";

import { BaseDatasetDataComponent } from "@common/components/base-dataset-data.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { BlockHeaderComponent } from "src/app/dataset-block/metadata-block/components/block-header/block-header.component";
import { BlockNavigationComponent } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.component";
import { EventDetailsComponent } from "src/app/dataset-block/metadata-block/components/event-details/event-details.component";
import { YamlViewSectionComponent } from "src/app/dataset-block/metadata-block/components/yaml-view-section/yaml-view-section.component";
import { BlockView, MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
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
export class MetadataBlockComponent extends BaseDatasetDataComponent implements OnInit {
    @Input(ProjectLinks.URL_PARAM_BLOCK_HASH) public blockHash: string;
    @Input(RoutingResolvers.METADATA_BLOCK_KEY) public metadata: MetadataBlockInfo;

    public readonly HISTORY_TYPE = DatasetViewTypeEnum.History;
    private static readonly BLOCKS_PER_PAGE = 10;
    public datasetInfo$: Observable<DatasetInfo>;
    public datasetHistoryUpdate$: Observable<MaybeNull<DatasetHistoryUpdate>>;
    public blockView: BlockView = BlockView.PROPERTIES;
    public readonly BlockView: typeof BlockView = BlockView;

    public ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges;
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetHistoryUpdate$ = this.datasetSubsService.historyChanges;
        this.datasetInfo$ = this.datasetInfoFromUrlChanges;
        this.loadHistory();
        this.loadDatasetBasicDataWithPermissions();
    }

    public onPageChange(currentPage: number): void {
        this.loadHistory(currentPage - 1);
    }

    public toggleYamlView(event: MatSlideToggleChange): void {
        this.blockView = event.checked ? BlockView.YAML : BlockView.PROPERTIES;
    }

    private loadDatasetBasicDataWithPermissions(): void {
        this.datasetService
            .requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private loadHistory(page = 0): void {
        this.datasetService
            .requestDatasetHistory(this.getDatasetInfoFromUrl(), MetadataBlockComponent.BLOCKS_PER_PAGE, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
