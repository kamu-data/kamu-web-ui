import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { PageBasedInfo } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    @Input() public currentPage: number;
    @Input() public pageInfo: PageBasedInfo;
    @Output() public pageChangeEvent = new EventEmitter<number>();

    private previousPage: number;

    public onPageChange(currentPage: number) {
        if (currentPage !== this.previousPage) {
            this.previousPage = currentPage;
            this.pageChangeEvent.emit(currentPage);
        }
    }
}
