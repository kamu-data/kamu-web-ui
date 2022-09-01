import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { PageBasedInfo } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination-component.sass"],
})
export class PaginationComponent implements OnChanges {
    @Input() public currentPage: number;
    @Input() public pageInfo: PageBasedInfo;
    @Output() public pageChangeEvent = new EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }>();

    private previousPage: number;

    public ngOnChanges(changes: SimpleChanges): void {
        const page = changes.currentPage;
        if (!this.currentPage) {
            this.previousPage = 1;
            this.currentPage = 1;
        }
        if (!page.previousValue && page.firstChange) {
            this.previousPage = page.currentValue as number;
        }
        if (page.currentValue) {
            this.previousPage = page.currentValue as number;
            this.currentPage = page.currentValue as number;
        }
    }

    public onPageChange(currentPage: number, isClick = false) {
        console.log("page change");

        if (currentPage !== this.previousPage) {
            this.previousPage = currentPage;
            this.pageChangeEvent.emit({ currentPage, isClick });
        }
    }
}
