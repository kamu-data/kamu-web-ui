import { Component, EventEmitter, Input, Output } from "@angular/core";
import {DataViewSchema, PageInfoInterface} from "../../../interface/search.interface";

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
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
    };
    public sqlRequestCode: string =
        "CREATE TABLE dbo.EmployeePhoto\n" +
        "(\n" +
        "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
        "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
        "    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n" +
        "                    UNIQUE DEFAULT NEWID()\n" +
        ");\n" +
        "\n" +
        "GO\n}";

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
}
