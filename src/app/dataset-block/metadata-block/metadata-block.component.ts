import { MaybeNull } from "./../../common/app.types";
import { DatasetHistoryUpdate } from "./../../dataset-view/dataset.subscriptions.interface";
import { DatasetService } from "./../../dataset-view/dataset.service";
import { Subscription } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { BaseProcessingComponent } from "./../../common/base.processing.component";
import { DatasetViewTypeEnum } from "./../../dataset-view/dataset-view.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import { filter, pluck } from "rxjs/operators";
import { NavigationEnd, Router } from "@angular/router";
import { BlockService } from "./block.service";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import _ from "lodash";

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
        private cdr: ChangeDetectorRef,
        private router: Router,
    ) {
        super();
    }

    public datasetInfo: DatasetInfo;
    public datasetViewType = DatasetViewTypeEnum.History;
    public blockHash: string;
    public datasetHistoryUpdate: MaybeNull<DatasetHistoryUpdate> = null;
    private blocksPerPage = 10;

    ngOnInit(): void {
        this.datasetInfo = this.getDatasetInfoFromUrl();
        this.trackSubscriptions(
            this.activatedRoute.params.pipe(pluck(ProjectLinks.URL_PARAM_BLOCK_HASH)).subscribe((hash: string) => {
                this.blockHash = hash;
            }),
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                if (!_.isEqual(this.datasetInfo, this.getDatasetInfoFromUrl())) {
                    this.trackSubscription(this.loadHistory());
                }
                this.datasetInfo = this.getDatasetInfoFromUrl();
                this.trackSubscription(this.loadMetadataBlock());
            }),
            this.loadMetadataBlock(),
            this.loadHistory(),
            this.appDatasetSubsService.onDatasetHistoryChanges.subscribe((result: DatasetHistoryUpdate) => {
                this.datasetHistoryUpdate = result;
                this.cdr.detectChanges();
            }),
        );
    }

    public onPageChange(currentPage: number): void {
        this.trackSubscription(this.loadHistory(currentPage - 1));
    }

    private loadMetadataBlock(): Subscription {
        return this.blockService.requestMetadataBlock(this.getDatasetInfoFromUrl(), this.blockHash).subscribe();
    }

    private loadHistory(page = 0): Subscription {
        return this.datasetService
            .requestDatasetHistory(this.getDatasetInfoFromUrl(), this.blocksPerPage, page)
            .subscribe();
    }
}
