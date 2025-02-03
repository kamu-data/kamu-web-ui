import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-custom-pagination",
    templateUrl: "custom-pagination.component.html",
    styleUrls: ["custom-pagination.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPaginationComponent implements OnChanges {
    @Input({ required: true }) public date = "";
    @Input({ required: true }) public hash = "";
    @Input({ required: true }) public pageIndex: number; // current offset
    @Input({ required: true }) public limit: number; // record per page
    @Input({ required: true }) public total: number; // total records
    @Input() public range = 5;
    @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
    public totalPageNo: number[] = [];
    public totalSizeOfPages: number = 0;

    public ngOnChanges() {
        this.totalSizeOfPages = this.total / this.limit;
        this.totalSizeOfPages = Math.ceil(this.totalSizeOfPages);

        this.totalPageNo = [];
        for (let i = 1; i <= this.totalSizeOfPages; i++) {
            this.totalPageNo.push(i);
        }
    }

    public pageChangeBackward() {
        if (this.pageIndex > 0) {
            this.pageIndex = this.pageIndex - 1;
        }
        this.pageChange.emit(this.pageIndex);
    }

    public pageChangeForward() {
        if (this.pageIndex < this.totalSizeOfPages) {
            this.pageIndex = this.pageIndex + 1;
        }
        this.pageChange.emit(this.pageIndex);
    }
}
