import { DatasetHistoryUpdate } from "./../../dataset-view/dataset.subscriptions.interface";
import { DatasetService } from "./../../dataset-view/dataset.service";
import { Observable, Subscription, combineLatest } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { BaseProcessingComponent } from "./../../common/base.processing.component";
import { DatasetViewTypeEnum } from "./../../dataset-view/dataset-view.interface";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import { map } from "rxjs/operators";
import { Params } from "@angular/router";
import { BlockService } from "./block.service";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    styleUrls: ["./metadata-block.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent extends BaseProcessingComponent implements OnInit {
    constructor(
        private blockService: BlockService,
        private datasetService: DatasetService,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
    ) {
        super();
    }

    public readonly HISTORY_TYPE = DatasetViewTypeEnum.History;
    private static readonly BLOCKS_PER_PAGE = 10;

    public datasetInfo$: Observable<DatasetInfo>;
    public blockHash$: Observable<string>;
    public datasetHistoryUpdate$: Observable<DatasetHistoryUpdate>;

    public ngOnInit(): void {
        this.datasetInfo$ = this.datasetInfoFromUrl;
        this.blockHash$ = this.activatedRoute.params.pipe(
            map((params: Params) => params[ProjectLinks.URL_PARAM_BLOCK_HASH] as string),
        );
        combineLatest([this.datasetInfo$, this.blockHash$]).subscribe(
            ([datasetInfo, blockHash]: [DatasetInfo, string]) => {
                this.trackSubscriptions(this.blockService.requestMetadataBlock(datasetInfo, blockHash).subscribe());
            },
        );
        this.trackSubscription(this.loadHistory());

        this.datasetHistoryUpdate$ = this.appDatasetSubsService.onDatasetHistoryChanges;
    }

    public onPageChange(currentPage: number): void {
        this.trackSubscription(this.loadHistory(currentPage - 1));
    }

    private loadHistory(page = 0): Subscription {
        return this.datasetService
            .requestDatasetHistory(this.getDatasetInfoFromUrl(), MetadataBlockComponent.BLOCKS_PER_PAGE, page)
            .subscribe();
    }
}
