import {
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ObjectInterface } from "src/app/dataset-view/datasetSubs.interface";
import { DataSchemaField } from "src/app/interface/search.interface";
import AppValues from "../../common/app.values";
import { TableSourceInterface } from "./dynamic-table.interface";

const ELEMENT_DATA: TableSourceInterface = [];
@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.sass"],
})
export class DynamicTableComponent
    implements OnInit, OnChanges, AfterContentInit
{
    @Input() public hasTableHeader: boolean;
    @Input() public tableSource?: TableSourceInterface;
    @Input() public idTable = "";
    @Output() public selectRowEmit: EventEmitter<string> = new EventEmitter();

    public dataSource = new MatTableDataSource<
        DataSchemaField | ObjectInterface
    >(ELEMENT_DATA);
    public displayedColumns: string[] = [];

    public ngOnInit(): void {
        if (this.tableSource) {
            this.renderTable(this.tableSource);
        }
    }
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.tableSource && changes) {
            this.renderTable(this.tableSource);
        }
    }

    public ngAfterContentInit(): void {
        if (this.tableSource) {
            this.renderTable(this.tableSource);
        }
    }

    public changeColumnName(columnName: string): string {
        columnName = columnName.replace("_", " ");
        let newColumnName = "";

        for (let i = 0; i < columnName.length; i++) {
            if (columnName.charAt(i) === columnName.charAt(i).toUpperCase()) {
                newColumnName += " " + columnName.charAt(i);
            } else {
                newColumnName += columnName.charAt(i);
            }
        }
        newColumnName = newColumnName.toLocaleLowerCase();

        return AppValues.capitalizeFirstLetter(newColumnName);
    }

    public onSelectRow(row: string): void {
        this.selectRowEmit.emit(row);
    }

    private renderTable(data: TableSourceInterface): void {
        if (data.length === 0) {
            this.dataSource.data = [];
            return;
        }
        this.dataSource.data = [];
        this.displayedColumns = Object.keys(data[0]);

        const dataSource = this.dataSource.data;
        data.forEach((field: DataSchemaField | ObjectInterface) => {
            dataSource.push(field);
        });
        this.dataSource.data = dataSource;
        this.dataSource = new MatTableDataSource(dataSource);
    }
}
