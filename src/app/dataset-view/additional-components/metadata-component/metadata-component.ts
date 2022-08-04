import {
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import {
    DataViewSchema,
} from "../../../interface/search.interface";
import AppValues from "../../../common/app.values";
import {DatasetViewContentInterface, PaginationInfoInterface} from "../../dataset-view.interface";

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent {
    @Input() public currentPage: number;
    @Input() public currentSchema: DataViewSchema;
    @Input() public pageInfo: PaginationInfoInterface;
    @Input() public datasetInfo: any;
    @Input() public tableData: DatasetViewContentInterface;
    @Output() public pageChangeEvent: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();
    @Output() onClickDatasetEmit: EventEmitter<string> = new EventEmitter();

    public page = 1;
    private previousPage: number;
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
        readOnly: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false,
        },
    };
    public selectPage(page: string) {
        this.page = parseInt(page, 10) || 1;
    }
    public selectTopic(topicName: string): void {
        this.onSelectTopicEmit.emit(topicName);
    }
    public onClickDataset(idDataset: string): void {
        this.onClickDatasetEmit.emit(idDataset);
    }
    public shortHash(hash: string): string {
        return hash.slice(-8);
    }
    public momentConverDatetoLocalWithFormat(date: string): string {
        return AppValues.momentConverDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: "DD MMM YYYY",
            isTextDate: true,
        });
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
