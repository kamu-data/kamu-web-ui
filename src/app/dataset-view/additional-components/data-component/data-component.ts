import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    DataViewSchema,
    PageInfoInterface,
} from "../../../interface/search.interface";
import DataTabValues from "./mock.data";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
})
export class DataComponent {
    @Input() public tableData: {
        isTableHeader: boolean;
        displayedColumns?: any[];
        tableSource: any;
        isResultQuantity: boolean;
        isClickableRow: boolean;
        pageInfo: PageInfoInterface;
        totalCount: number;
    };
    @Input() public currentSchema: DataViewSchema;
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onRunSQLRequestEmit: EventEmitter<string> = new EventEmitter();
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
    };
    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode: string = DataTabValues.sqlRequestCode;
    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
    public onRunSQLRequest(sqlRequestCode?: string): void {
        this.onRunSQLRequestEmit.emit(sqlRequestCode || this.sqlRequestCode);
    }
}
