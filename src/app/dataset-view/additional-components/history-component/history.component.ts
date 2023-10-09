import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetHistoryUpdate } from "../../dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent {
    @Input() public datasetName: string;
    @Output() onPageChangeEmit = new EventEmitter<number>();
    public historyUpdate$: Observable<DatasetHistoryUpdate> = this.datasetSubsService.historyChanges;

    constructor(private datasetSubsService: DatasetSubscriptionsService) {
        super();
    }

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }
}
