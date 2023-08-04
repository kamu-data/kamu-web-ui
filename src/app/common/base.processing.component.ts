import { DatasetInfo } from "./../interface/navigation.interface";
import { ModalService } from "./../components/modal/modal.service";
import { DatasetNavigationInterface, DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import { NavigationService } from "./../services/navigation.service";
import { promiseWithCatch } from "./app.helpers";
import { BaseComponent } from "./base.component";
import { inject } from "@angular/core";

export class BaseProcessingComponent extends BaseComponent {
    public navigationService = inject(NavigationService);
    public modalService = inject(ModalService);

    public showOwnerPage(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public getDatasetNavigation(datasetInfo: DatasetInfo): DatasetNavigationInterface {
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
            [searchAdditionalButtonsEnum.DeriveFrom]: () => this.onClickDeriveFrom(),

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
}
