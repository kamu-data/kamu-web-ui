import { NavigationService } from "./../../../../services/navigation.service";
import { ChangeDetectionStrategy, Input } from "@angular/core";
import { Component } from "@angular/core";
import {
    DatasetSearchOverviewFragment,
    PageBasedInfo,
    User,
} from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    styleUrls: ["./datasets-tab.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent {
    @Input() public datasets: DatasetSearchOverviewFragment[];
    @Input() public accountName: string;
    @Input() public accountViewType: AccountTabs;
    @Input() public pageInfo: PageBasedInfo;
    public currentPage = 1;
    public isClickableRow = true;

    constructor(private navigationService: NavigationService) {}

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: (row.owner as User).name,
            datasetName: row.name as string,
        });
    }

    public onPageChange(params: {
        currentPage?: number;
        isClick?: boolean;
    }): void {
        params.currentPage
            ? (this.currentPage = params.currentPage)
            : (this.currentPage = 1);
        if (this.currentPage === 1) {
            this.navigationService.navigateToOwnerView(
                this.accountName,
                this.accountViewType,
            );
            return;
        }
        this.navigationService.navigateToOwnerView(
            this.accountName,
            this.accountViewType,
            params.currentPage,
        );
    }
}
