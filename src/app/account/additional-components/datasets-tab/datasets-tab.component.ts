import { ChangeDetectionStrategy, inject, Input } from "@angular/core";
import { Component } from "@angular/core";
import { DatasetSearchOverviewFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";
import _ from "lodash";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent {
    @Input({ required: true }) public datasets: DatasetSearchOverviewFragment[];
    @Input({ required: true }) public accountName: string;
    @Input({ required: true }) public pageInfo: PageBasedInfo;
    public isClickableRow = true;

    private navigationService = inject(NavigationService);

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
