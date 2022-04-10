import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    DatasetInfoInterface,
    PageInfoInterface,
} from "../../../interface/search.interface";
import AppValues from "../../../common/app.values";
import { DataHelpersService } from "src/app/services/datahelpers.service";
@Component({
    selector: "app-overview",
    templateUrl: "overview-component.html",
})
export class OverviewComponent {
    @Input() public isMarkdownEditView: boolean;
    @Input() public markdownText: any;
    @Input() public datasetInfo: DatasetInfoInterface;
    @Input() public resultUnitText: string;
    @Input() public tableData: {
        isTableHeader: boolean;
        displayedColumns?: any[];
        tableSource: any;
        isResultQuantity: boolean;
        isClickableRow: boolean;
        pageInfo: PageInfoInterface;
        totalCount: number;
    };
    @Output() onToggleReadmeViewEmit: EventEmitter<null> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();

    constructor(public dataHelpers: DataHelpersService) {}

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
    public toggleReadmeView(): void {
        this.onToggleReadmeViewEmit.emit();
    }
    public selectTopic(topicName: string): void {
        this.onSelectTopicEmit.emit(topicName);
    }
}
