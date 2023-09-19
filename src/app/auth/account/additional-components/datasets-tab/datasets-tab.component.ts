import { NavigationService } from "../../../../services/navigation.service";
import { ChangeDetectionStrategy, Input } from "@angular/core";
import { Component } from "@angular/core";
import { DatasetSearchOverviewFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent {
    @Input() public datasets: DatasetSearchOverviewFragment[];
    @Input() public accountName: string;
    @Input() public pageInfo: PageBasedInfo;
    public currentPage = 1;
    public isClickableRow = true;

    constructor(private navigationService: NavigationService) {}

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: row.owner.accountName,
            datasetName: row.name,
        });
    }

    public onPageChange(currentPage?: number): void {
        currentPage ? (this.currentPage = currentPage) : (this.currentPage = 1);
        if (this.currentPage === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS, currentPage);
    }
}
