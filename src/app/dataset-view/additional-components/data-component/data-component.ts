import {
    Component, EventEmitter, Input, Output,
} from "@angular/core";
import {PageInfoInterface} from "../../../interface/search.interface";
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
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();

    public sqlSchema = "{\"name\": \"Row\", \"type\": \"struct\", \"fields\": [{\"name\": \"offset\", \"repetition\": \"OPTIONAL\", \"type\": \"INT64\"}, {\"name\": \"system_time\", \"repetition\": \"OPTIONAL\", \"type\": \"INT64\", \"logicalType\": \"TIMESTAMP(MILLIS,true)\"}, {\"name\": \"reported_date\", \"repetition\": \"OPTIONAL\", \"type\": \"INT64\", \"logicalType\": \"TIMESTAMP(MILLIS,true)\"}, {\"name\": \"province\", \"repetition\": \"OPTIONAL\", \"type\": \"BYTE_ARRAY\", \"logicalType\": \"STRING\"}, {\"name\": \"total_daily\", \"repetition\": \"OPTIONAL\", \"type\": \"INT64\"}]}"
    public sqlEditorOptions = {
        theme: 'vs',
        language: 'sql',
    };
    public schemaOptions = {
        theme: 'vs',
        language: 'json',
        readOnly: true,
        minimap: {
            enabled: false
        },
        lineNumbers: "off",
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0
    };
    public sqlRequestCode: string = 'CREATE TABLE dbo.EmployeePhoto\n' +
        '(\n' +
        '    EmployeeId INT NOT NULL PRIMARY KEY,\n' +
        '    Photo VARBINARY(MAX) FILESTREAM NULL,\n' +
        '    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n' +
        '                    UNIQUE DEFAULT NEWID()\n' +
        ');\n' +
        '\n' +
        'GO\n}';

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
}
