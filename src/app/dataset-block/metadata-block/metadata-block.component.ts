import { DatasetHistoryUpdate } from "./../../dataset-view/dataset.subscriptions.interface";
import { DatasetService } from "./../../dataset-view/dataset.service";
import { Subscription } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { BaseProcessingComponent } from "./../../common/base.processing.component";
import { DatasetViewTypeEnum } from "./../../dataset-view/dataset-view.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import { filter, pluck, switchMap } from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ModalService } from "src/app/components/modal/modal.service";
import { NavigationService } from "src/app/services/navigation.service";
import { BlockService } from "./block.service";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    styleUrls: ["./metadata-block.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent
    extends BaseProcessingComponent
    implements OnInit
{
    constructor(
        private blockService: BlockService,
        private datasetService: DatasetService,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        navigationService: NavigationService,
        modalService: ModalService,
        activatedRoute: ActivatedRoute,
    ) {
        super(navigationService, modalService, activatedRoute);
    }

    public datasetInfo: DatasetInfo;
    public datasetViewType = DatasetViewTypeEnum.History;
    public blockHash: string;
    public datasetHistoryUpdate: DatasetHistoryUpdate;
    private blocksPerPage = 4;

    ngOnInit(): void {
        this.datasetInfo = this.getDatasetInfoFromUrl();

        this.trackSubscriptions(
            this.loadHistory(),
            this.activatedRoute.params
                .pipe(pluck(ProjectLinks.URL_PARAM_BLOCK_HASH))
                .subscribe((hash: string) => {
                    this.blockHash = hash;
                }),
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe(() =>
                    this.trackSubscription(this.loadMetadataBlock()),
                ),
            this.loadMetadataBlock(),
        );
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.loadHistory(params.currentPage - 1);
    }

    private loadMetadataBlock(): Subscription {
        return this.blockService
            .requestMetadataBlock(this.datasetInfo, this.blockHash)
            .subscribe();
    }

    private loadHistory(page = 0) {
        return this.datasetService
            .requestDatasetHistory(this.datasetInfo, this.blocksPerPage, page)
            .pipe(
                switchMap(
                    () => this.appDatasetSubsService.onDatasetHistoryChanges,
                ),
            )
            .subscribe((result: DatasetHistoryUpdate) => {
                this.datasetHistoryUpdate = result;
                this.cdr.detectChanges();
            });
    }
}
