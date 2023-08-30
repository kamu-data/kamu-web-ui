import { Component, EventEmitter, Input, Output } from "@angular/core";

import AppValues from "../../../../common/app.values";

@Component({
    selector: "app-load-more",
    templateUrl: "./load-more.component.html",
    styleUrls: ["./load-more.component.sass"],
})
export class LoadMoreComponent {
    public rowsNumber: number = AppValues.SQL_QUERY_LIMIT;
    public isHolderVisible = false;

    @Input() public isAllDataLoaded = false;

    @Output() public loadMoreEmit = new EventEmitter<number>();

    readonly ROWS_OPTIONS: number[] = [
        AppValues.SQL_QUERY_LIMIT / 2,
        AppValues.SQL_QUERY_LIMIT,
        AppValues.SQL_QUERY_LIMIT * 2,
    ];

    public toggleOptions(): void {
        this.isHolderVisible = !this.isHolderVisible;
    }

    public loadMore(): void {
        if (!this.isAllDataLoaded) {
            this.loadMoreEmit.emit(this.rowsNumber);
        }
    }
}
