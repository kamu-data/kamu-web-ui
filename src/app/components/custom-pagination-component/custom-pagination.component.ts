import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ChangeDetectionStrategy,
} from "@angular/core";

@Component({
    selector: "app-custom-pagination",
    templateUrl: "custom-pagination.component.html",
    styleUrls: ["custom-pagination.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPaginationComponent implements OnChanges {
    @Input() date = "";
    @Input() hash = "";
    @Input() pageIndex: number; // current offset
    @Input() limit: number; // record per page
    @Input() total: number; // total records
    @Input() range = 5;
    @Output() pageChange: EventEmitter<number>;
    totalPageNo: number[];
    totalSizeOfPages: number;

    constructor() {
        this.totalSizeOfPages = 0;
        this.totalPageNo = [];
        this.pageChange = new EventEmitter<number>();
    }

    public ngOnChanges() {
        this.totalSizeOfPages = this.total / this.limit;
        this.totalSizeOfPages = Math.ceil(this.totalSizeOfPages);

        this.totalPageNo = [];
        for (let i = 1; i <= this.totalSizeOfPages; i++) {
            this.totalPageNo.push(i);
        }
    }

    pageChangeBackward() {
        if (this.pageIndex > 0) {
            this.pageIndex = this.pageIndex - 1;
        }
        this.pageChange.emit(this.pageIndex);
    }

    pageChangeForward() {
        if (this.pageIndex < this.totalSizeOfPages) {
            this.pageIndex = this.pageIndex + 1;
        }
        this.pageChange.emit(this.pageIndex);
    }
}
