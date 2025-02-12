import { DatasetHistoryUpdate } from "../../dataset-view/dataset.subscriptions.interface";
import { Observable, Subscription, combineLatest } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "../../dataset-view/dataset-view.interface";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { map, switchMap } from "rxjs/operators";
import { Params } from "@angular/router";
import { BlockService } from "./block.service";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseDatasetDataComponent } from "src/app/common/components/base-dataset-data.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent extends BaseDatasetDataComponent implements OnInit {
    public readonly HISTORY_TYPE = DatasetViewTypeEnum.History;
    private static readonly BLOCKS_PER_PAGE = 10;

    public datasetInfo$: Observable<DatasetInfo>;
    public blockHash$: Observable<string>;
    public datasetHistoryUpdate$: Observable<MaybeNull<DatasetHistoryUpdate>>;
    private blockService = inject(BlockService);

    public ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges;
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetHistoryUpdate$ = this.datasetSubsService.historyChanges;
        this.datasetInfo$ = this.datasetInfoFromUrlChanges;
        this.blockHash$ = this.activatedRoute.params.pipe(
            map((params: Params) => params[ProjectLinks.URL_PARAM_BLOCK_HASH] as string),
        );
        combineLatest([this.datasetInfo$, this.blockHash$])
            .pipe(
                switchMap(([datasetInfo, blockHash]: [DatasetInfo, string]) =>
                    this.blockService.requestMetadataBlock(datasetInfo, blockHash),
                ),
            )
            .subscribe();
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
