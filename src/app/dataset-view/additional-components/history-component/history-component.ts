import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { DatasetHistoryUpdate } from "../../datasetSubs.interface";
import { AppDatasetSubsService } from "../../datasetSubs.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
})
export class HistoryComponent implements OnInit {
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();

    public page = 1;
    public currentPage: number = 1;
    public pageInfo: PageBasedInfo;
    public history: MetadataBlockFragment[] = [];

    constructor(private appDatasetSubsService: AppDatasetSubsService) {}

    ngOnInit(): void {
        this.appDatasetSubsService.onDatasetHistoryChanges.subscribe(
            (historyUpdate: DatasetHistoryUpdate) => {
                this.history = historyUpdate.history;
                this.pageInfo = historyUpdate.pageInfo;
                this.currentPage = this.pageInfo.currentPage + 1;
            },
        );
    }
    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.onPageChangeEmit.emit(params);
    }

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
}
