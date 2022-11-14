import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { capitalizeFirstLetter } from "src/app/common/app.helpers";
import {
    TableSourceInterface,
    TableSourceRowInterface,
} from "./dynamic-table.interface";

@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTableComponent
    implements OnInit, OnChanges, AfterContentInit
{
    @Input() public hasTableHeader: boolean;
    @Input() public tableSource?: TableSourceInterface;
    @Input() public idTable = "";
    @Output() public selectRowEmit = new EventEmitter<string>();

    public dataSource = new MatTableDataSource<TableSourceRowInterface>([]);
    public displayedColumns: string[] = [];

    public ngOnInit(): void {
        if (this.tableSource) {
            this.renderTable(this.tableSource);
        }
    }
    public ngOnChanges(): void {
        if (this.tableSource) {
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

        return capitalizeFirstLetter(newColumnName);
    }

    public onSelectRow(row: string): void {
        this.selectRowEmit.emit(row);
    }

    private renderTable(data: TableSourceInterface): void {
        if (data.length === 0) {
            this.dataSource.data = [];
            this.displayedColumns = [];
            return;
        }
        this.dataSource.data = [];
        this.displayedColumns = Object.keys(data[0]);

        const dataSource = this.dataSource.data;
        data.forEach((field: TableSourceRowInterface) => {
            dataSource.push(field);
        });
        this.dataSource.data = dataSource;
        this.dataSource = new MatTableDataSource(dataSource);
    }
}
