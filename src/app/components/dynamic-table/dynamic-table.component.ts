import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { TableSourceRowInterface } from "./dynamic-table.interface";

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
    @Input() public schemaFields: DataSchemaField[];
    @Input() public dataRows?: DataRow[];
    @Input() public idTable = "";

    public dataSource = new MatTableDataSource<TableSourceRowInterface>([]);
    public displayedColumns: string[] = [];

    public ngOnInit(): void {
        this.displayTable();
    }

    public ngOnChanges(): void {
        this.displayTable();
    }

    public ngAfterContentInit(): void {
        this.displayTable();
    }

    private displayTable(): void {
        // Cornercase - schema is empty, nothing to display
        if (this.schemaFields.length === 0) {
            this.dataSource.data = [];
            this.displayedColumns = [];

            // Special case: displaying schema itself
        } else if (!this.dataRows) {
            this.dataSource.data = this.schemaFields;
            const arrFieldsLength = this.schemaFields.map(
                (item) => Object.keys(item).length,
            );
            const indexFieldMaxLength = arrFieldsLength.indexOf(
                Math.max.apply(null, arrFieldsLength),
            );
            this.displayedColumns = Object.keys(
                this.schemaFields[indexFieldMaxLength],
            );

            // Casual case, displaying data
        } else {
            this.displayedColumns = this.schemaFields.map(
                (f: DataSchemaField) => f.name,
            );
            this.dataSource.data = this.dataRows;
        }
    }
}
