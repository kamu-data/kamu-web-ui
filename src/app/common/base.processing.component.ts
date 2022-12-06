import { DatasetInfo } from "./../interface/navigation.interface";
import { ModalService } from "./../components/modal/modal.service";
import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "../dataset-view/dataset-view.interface";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import { NavigationService } from "./../services/navigation.service";
import { promiseWithCatch, requireValue } from "./app.helpers";
import { BaseComponent } from "./base.component";
import { ActivatedRoute, ParamMap } from "@angular/router";
import ProjectLinks from "../project-links";
import { Component } from "@angular/core";

@Component({
    template: "",
})
export class BaseProcessingComponent extends BaseComponent {
    constructor(
        protected navigationService: NavigationService,
        protected modalService: ModalService,
        protected activatedRoute: ActivatedRoute,
    ) {
        super();
    }
    public showOwnerPage(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public getDatasetNavigation(
        datasetInfo: DatasetInfo,
    ): DatasetNavigationInterface {
        return {
            navigateToOverview: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: datasetInfo.accountName,
                    datasetName: datasetInfo.datasetName,
                });
            },
            navigateToData: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: datasetInfo.accountName,
                    datasetName: datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Data,
                });
            },
            navigateToMetadata: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: datasetInfo.accountName,
                    datasetName: datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Metadata,
                });
            },
            navigateToHistory: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: datasetInfo.accountName,
                    datasetName: datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.History,
                });
            },
            navigateToLineage: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: datasetInfo.accountName,
                    datasetName: datasetInfo.datasetName,
                    tab: DatasetViewTypeEnum.Lineage,
                });
            },
            navigateToDiscussions: () => {
                console.log("Navigate to discussions");
            },
        };
    }

    public onClickSearchAdditionalButton(method: string) {
        const mapperMethod: {
            [key in searchAdditionalButtonsEnum]: () => void;
        } = {
            [searchAdditionalButtonsEnum.DeriveFrom]: () =>
                this.onClickDeriveFrom(),

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

    public getDatasetInfoFromUrl(): DatasetInfo {
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
}
