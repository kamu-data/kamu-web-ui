import { ChangeDetectionStrategy, inject, Input } from "@angular/core";
import { Component } from "@angular/core";
import { DatasetSearchOverviewFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";
import { NavigationService } from "src/app/services/navigation.service";
import { isNil } from "src/app/common/helpers/app.helpers";

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

    public onPageChange(currentPage?: number): void {
        if (isNil(currentPage) || currentPage === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS, currentPage);
    }
}
