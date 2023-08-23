import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { MetadataBlockFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetHistoryUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent implements OnInit {
    @Input() public datasetName?: string;
    @Output() onPageChangeEmit = new EventEmitter<number>();

    public currentState?: {
        pageInfo: PageBasedInfo;
        history: MetadataBlockFragment[];
    };
    public totalPages: number;

    constructor(private appDatasetSubsService: AppDatasetSubscriptionsService, private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.appDatasetSubsService.onDatasetHistoryChanges.subscribe((historyUpdate: DatasetHistoryUpdate) => {
                this.currentState = {
                    pageInfo: historyUpdate.pageInfo,
                    history: historyUpdate.history,
                };
                if (historyUpdate.pageInfo.totalPages) this.totalPages = historyUpdate.pageInfo.totalPages;
                this.cdr.markForCheck();
            }),
        );
    }
    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }

    public get currentPage(): number {
        return this.currentState ? this.currentState.pageInfo.currentPage + 1 : 1;
    }
}
