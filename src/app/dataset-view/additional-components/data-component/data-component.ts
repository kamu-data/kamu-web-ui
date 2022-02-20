import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
    DatasetNameInterface,
    DataViewSchema,
    PageInfoInterface,
} from "../../../interface/search.interface";
import DataTabValues from "./mock.data";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
})
export class DataComponent implements OnInit {
    @Input() public tableData: {
        isTableHeader: boolean;
        displayedColumns?: any[];
        tableSource: any;
        isResultQuantity: boolean;
        isClickableRow: boolean;
        pageInfo: PageInfoInterface;
        totalCount: number;
    };
    @Input() public datasetName: DatasetNameInterface;
    @Input() public currentSchema: DataViewSchema;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onRunSQLRequestEmit: EventEmitter<string> = new EventEmitter();
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
    };
    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode: string = `select * from `;
    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
    public onRunSQLRequest(sqlRequestCode?: string): void {
        this.onRunSQLRequestEmit.emit(sqlRequestCode || this.sqlRequestCode);
    }
    public ngOnInit(): void {
        if (this.datasetName) {
            this.sqlRequestCode += `'${this.datasetName.name}'`;
        }
    }
}
