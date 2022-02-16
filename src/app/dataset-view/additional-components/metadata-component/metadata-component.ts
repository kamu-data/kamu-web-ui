import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from "@angular/core";
import { PageInfoInterface } from "../../../interface/search.interface";

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent {
    @Input() public currentPage: number;
    @Input() public pageInfo: PageInfoInterface;
    @Output() public pageChangeEvent: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();

    page = 4;

    getPageSymbol(current: number) {
        return ["A", "B", "C", "D", "E", "F", "G"][current - 1];
    }

    selectPage(page: string) {
        this.page = parseInt(page, 10) || 1;
    }

    formatInput(input: HTMLInputElement) {
        input.value = input.value.replace(FILTER_PAG_REGEX, "");
    }
    private previousPage: number;
    public onPageChange(currentPage: number): void {}
}
