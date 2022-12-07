import { Subscription } from "rxjs";
import { DatasetService } from "./../../dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { BaseProcessingComponent } from "./../../common/base.processing.component";
import { DatasetViewTypeEnum } from "./../../dataset-view/dataset-view.interface";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import { filter, pluck, tap } from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ModalService } from "src/app/components/modal/modal.service";
import { NavigationService } from "src/app/services/navigation.service";

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
        private datasetService: DatasetService,
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

    ngOnInit(): void {
        this.datasetInfo = this.getDatasetInfoFromUrl();
        this.trackSubscriptions(
            this.activatedRoute.params
                .pipe(pluck(ProjectLinks.URL_PARAM_BLOCK_HASH))
                .subscribe((hash: string) => {
                    this.blockHash = hash;
                }),
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    tap(() => {
                        this.getMetadataBlock();
                    }),
                )
                .subscribe(),
            this.getMetadataBlock(),
        );
    }

    private getMetadataBlock(): Subscription {
        return this.datasetService
            .requestMetadataBlock(this.datasetInfo, this.blockHash)
            .subscribe();
    }
}
