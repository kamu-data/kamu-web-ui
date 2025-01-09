import { MaybeNull } from "./../../common/app.types";
import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { TableSourceRowInterface } from "./dynamic-table.interface";

@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterContentInit {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public schemaFields: DataSchemaField[];
    @Input() public dataRows?: DataRow[];
    @Input({ required: true }) public idTable: string;

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

    public operationColumnMapper(value: string | number): string {
        if (typeof value === "number") {
            switch (value) {
                case 0:
                    return "+A";
                case 1:
                    return "-R";
                case 2:
                    return "-C";
                case 3:
                    return "+C";
                /* istanbul ignore next */
                default:
                    throw new Error("Unknown operation type");
            }
        } else return value;
    }

    public setOperationColumnClass(element: object, columnName: string): MaybeNull<object> {
        if (columnName === "op") {
            const key = columnName as keyof object;
            return {
                correction: key === "op" && [2, 3].includes(element[key]),
                retraction: key === "op" && element[key] === 1,
            };
        } else return null;
    }

    private displayTable(): void {
        // Corner case - schema is empty, nothing to display
        if (this.schemaFields.length === 0) {
            this.dataSource.data = [];
            this.displayedColumns = [];

            // Special case: displaying schema itself
        } else if (!this.dataRows) {
            this.dataSource.data = this.schemaFields;
            const arrFieldsLength = this.schemaFields.map((item) => Object.keys(item).length);
            const indexFieldMaxLength = arrFieldsLength.indexOf(Math.max.apply(null, arrFieldsLength));
            this.displayedColumns = Object.keys(this.schemaFields[indexFieldMaxLength]);

            // Casual case, displaying data
        } else {
            this.displayedColumns = this.schemaFields.map((f: DataSchemaField) => f.name);
            this.dataSource.data = this.dataRows;
        }
    }
}
