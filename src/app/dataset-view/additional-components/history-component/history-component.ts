import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { PaginationInfoInterface } from "../../dataset-view.interface";
import { AppDatasetSubsService } from "../../datasetSubs.service";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
})
export class HistoryComponent implements OnInit {
    @Input() public currentPage: number;
    @Input() public pageInfo: PaginationInfoInterface;
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();

    public page = 1;
    public history: MetadataBlockFragment[] = [];

    constructor(private appDatasetSubsService: AppDatasetSubsService) {}

    ngOnInit(): void {
        this.appDatasetSubsService.onDatasetHistoryChanges.subscribe(
            (history: MetadataBlockFragment[]) => {
                this.history = history;
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
