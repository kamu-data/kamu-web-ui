import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "./../../dataset-view/dataset-view.interface";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ModalService } from "./../../components/modal/modal.service";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
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
    public datasetInfo: DatasetInfo;
    public datasetViewType = DatasetViewTypeEnum.History;

    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
        private activatedRoute: ActivatedRoute,
    ) {
        super();
    }
    ngOnInit(): void {
        this.datasetInfo = this.getDatasetInfoFromUrl();
    }

    public showOwnerPage(): void {
        this.navigationService.navigateToOwnerView(
            this.datasetInfo.accountName,
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
                this.navigationService.navigateToDatasetView(this.datasetInfo);
            },
            navigateToData: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetInfo.accountName,
                    datasetName: this.datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Data,
                });
            },
            navigateToMetadata: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetInfo.accountName,
                    datasetName: this.datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Metadata,
                });
            },
            navigateToHistory: () => null,
            navigateToLineage: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetInfo.accountName,
                    datasetName: this.datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Lineage,
                });
            },
            navigateToDiscussions: () => {
                console.log("Navigate to discussions");
            },
        };
    }
}
