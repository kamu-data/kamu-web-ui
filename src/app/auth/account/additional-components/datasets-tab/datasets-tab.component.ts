import { NavigationService } from "../../../../services/navigation.service";
import { ChangeDetectionStrategy, Input } from "@angular/core";
import { Component } from "@angular/core";
import { DatasetSearchOverviewFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";
import _ from "lodash";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent {
    @Input() public datasets: DatasetSearchOverviewFragment[];
    @Input() public accountName: string;
    @Input() public pageInfo: PageBasedInfo;
    public isClickableRow = true;

    constructor(private navigationService: NavigationService) {}

    public get currentPage(): number {
        return this.pageInfo.currentPage + 1;
    }

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: row.owner.accountName,
            datasetName: row.name,
        });
    }

    public onPageChange(currentPage?: number): void {
        if (_.isNil(currentPage) || currentPage === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS, currentPage);
    }
}
