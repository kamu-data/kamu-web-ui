import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull } from "src/app/common/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent {
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private navigationService = inject(NavigationService);
    @Output() onPageChangeEmit = new EventEmitter<number>();
    public historyUpdate$: Observable<MaybeNull<DatasetHistoryUpdate>> = this.datasetSubsService.historyChanges;

    public onPageChange(currentPage: number, datasetInfo: DatasetInfo): void {
        this.navigationService.navigateToDatasetView({
            accountName: datasetInfo.accountName,
            datasetName: datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.History,
            page: currentPage,
        });
        // this.initDatasetViewByType(
        //     {
        //         accountName: this.datasetBasics.owner.accountName,
        //         datasetName: this.datasetBasics.name,
        //     },
        //     currentPage,
        // );
    }
}
