import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetHistoryUpdate } from "../../datasetSubs.interface";
import { AppDatasetSubsService } from "../../datasetSubs.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
})
export class HistoryComponent extends BaseComponent implements OnInit {
    @Output() onPageChangeEmit = new EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }>();

    public currentState?: {
        pageInfo: PageBasedInfo;
        history: MetadataBlockFragment[];
    };

    constructor(private appDatasetSubsService: AppDatasetSubsService) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.appDatasetSubsService.onDatasetHistoryChanges.subscribe(
                (historyUpdate: DatasetHistoryUpdate) => {
                    this.currentState = {
                        pageInfo: historyUpdate.pageInfo,
                        history: historyUpdate.history,
                    };
                },
            ),
        );
    }
    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.onPageChangeEmit.emit(params);
    }

    public get currentPage(): number {
        return this.currentState
            ? this.currentState.pageInfo.currentPage + 1
            : 1;
    }
}
