import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from "@angular/core";
import {DatasetInfoInterface, DataViewSchema, PageInfoInterface} from "../../../interface/search.interface";

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent {
    @Input() public currentPage: number;
    @Input() public currentSchema: DataViewSchema;
    @Input() public pageInfo: PageInfoInterface;
    @Input() public datasetInfo: DatasetInfoInterface;
    @Input() public tableData: {
        isTableHeader: boolean;
        displayedColumns?: any[];
        tableSource: any;
        isResultQuantity: boolean;
        isClickableRow: boolean;
        pageInfo: PageInfoInterface;
        totalCount: number;
    };
    @Output() public pageChangeEvent: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();

    public page = 1;
    private previousPage: number;
    public sqlRequestCode: string = `select * from `;
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
    };

    public getPageSymbol(current: number) {
        return ["A", "B", "C", "D", "E", "F", "G"][current - 1];
    }

    selectPage(page: string) {
        this.page = parseInt(page, 10) || 1;
    }

    formatInput(input: HTMLInputElement) {
        input.value = input.value.replace(FILTER_PAG_REGEX, "");
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
