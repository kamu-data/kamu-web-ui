import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PaginationInfoInterface } from "../../dataset-view.interface";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
})
export class HistoryComponent {
    @Input() public currentPage: number;
    @Input() public pageInfo: PaginationInfoInterface;
    @Input() public datasetHistory: any[];
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();

    public page = 1;

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
