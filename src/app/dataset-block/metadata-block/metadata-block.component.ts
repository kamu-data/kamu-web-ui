import { DatasetHistoryUpdate } from "../../dataset-view/dataset.subscriptions.interface";
import { Observable, Subscription } from "rxjs";
import { DatasetViewTypeEnum } from "../../dataset-view/dataset-view.interface";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { BlockService } from "./block.service";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseDatasetDataComponent } from "src/app/common/components/base-dataset-data.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent extends BaseDatasetDataComponent implements OnInit {
    public readonly HISTORY_TYPE = DatasetViewTypeEnum.History;
    private static readonly BLOCKS_PER_PAGE = 10;

    public datasetInfo$: Observable<DatasetInfo>;
    public block$: Observable<MaybeNull<MetadataBlockFragment>>;
    public blockHash: string;
    public datasetHistoryUpdate$: Observable<MaybeNull<DatasetHistoryUpdate>>;
    private blockService = inject(BlockService);

    public ngOnInit(): void {
        this.block$ = this.blockService.metadataBlockChanges;
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

    private loadDatasetBasicDataWithPermissions(): Subscription {
        return this.datasetService
            .requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private loadHistory(page = 0): Subscription {
        return this.datasetService
            .requestDatasetHistory(this.getDatasetInfoFromUrl(), MetadataBlockComponent.BLOCKS_PER_PAGE, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
