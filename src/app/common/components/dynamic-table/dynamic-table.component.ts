/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { DataRow, DataSchemaField, OperationColumnClassEnum } from "src/app/interface/dataset.interface";
import { TableSourceRowInterface } from "./dynamic-table.interface";
import { NgFor, NgClass, NgIf } from "@angular/common";

@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatTableModule,
        NgFor,
        NgClass,
        NgIf,
    ],
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterContentInit {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public schemaFields: DataSchemaField[];
    @Input() public dataRows?: DataRow[];
    @Input({ required: true }) public idTable: string;

    public dataSource = new MatTableDataSource<TableSourceRowInterface>([]);
    public displayedColumns: string[] = [];
    public readonly OperationColumnClassEnum: typeof OperationColumnClassEnum = OperationColumnClassEnum;

    public ngOnInit(): void {
        this.displayTable();
    }

    public ngOnChanges(): void {
        this.displayTable();
    }

    public ngAfterContentInit(): void {
        this.displayTable();
    }

    public get hasData(): boolean {
        return Boolean(this.dataRows?.length);
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
