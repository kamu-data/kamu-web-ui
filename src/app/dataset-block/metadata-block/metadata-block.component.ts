import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "./../../dataset-view/dataset-view.interface";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ModalService } from "./../../components/modal/modal.service";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { promiseWithCatch, requireValue } from "src/app/common/app.helpers";
import { searchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    styleUrls: ["./metadata-block.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent extends BaseComponent implements OnInit {
    public datasetBasics?: DatasetBasicsFragment;
    public datasetViewType = DatasetViewTypeEnum.History;

    constructor(
        private navigationService: NavigationService,
        private appDatasetService: DatasetService,
        private modalService: ModalService,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }
    ngOnInit(): void {
        this.datasetViewType = DatasetViewTypeEnum.History;
        this.trackSubscriptions(
            this.appDatasetService
                .requestDatasetMainData(this.getDatasetInfoFromUrl())
                .subscribe(),
            this.appDatasetService.onDatasetChanges.subscribe(
                (basics: DatasetBasicsFragment) => {
                    this.datasetBasics = basics;
                    this.cdr.markForCheck();
                },
            ),
        );
        this.cdr.markForCheck();
    }

    public showOwnerPage(): void {
        if (this.datasetBasics)
            this.navigationService.navigateToOwnerView(
                this.datasetBasics.owner.name,
            );
    }

    public onClickSearchAdditionalButton(method: string) {
        const mapperMethod: {
            [key in searchAdditionalButtonsEnum]: () => void;
        } = {
            [searchAdditionalButtonsEnum.DeriveFrom]: () =>
                this.onClickDeriveFrom(),
            [searchAdditionalButtonsEnum.Reputation]: () =>
                this.onClickReputation(),
            [searchAdditionalButtonsEnum.Explore]: () => this.onClickExplore(),
            [searchAdditionalButtonsEnum.Descission]: () =>
                this.onClickDescission(),
            [searchAdditionalButtonsEnum.Starred]: () => null,
            [searchAdditionalButtonsEnum.UnWatch]: () => null,
        };
        mapperMethod[method as searchAdditionalButtonsEnum]();

        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    private onClickDeriveFrom(): void {
        console.log("onClickDeriveFrom");
    }

    private onClickExplore(): void {
        console.log("onClickExplore");
    }

    private onClickReputation(): void {
        console.log("onClickReputation");
    }

    private onClickDescission(): void {
        console.log("onClickDescission");
    }

    private getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }

    public getDatasetNavigation(): DatasetNavigationInterface {
        return {
            navigateToOverview: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                    });
                }
            },
            navigateToData: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Data,
                    });
                }
            },
            navigateToMetadata: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Metadata,
                    });
                }
            },
            navigateToHistory: () => null,
            navigateToLineage: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Lineage,
                    });
                }
            },
            navigateToDiscussions: () => {
                console.log("Navigate to discussions");
            },
        };
    }
}
