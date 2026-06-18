/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ClipboardModule } from "@angular/cdk/clipboard";
import { JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";

import { odfType2String, schemaEditAsDataRows } from "@common/helpers/data-schema.helpers";
import {
    DataSchemaField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { DynamicTableColumnDescriptor } from "../dynamic-table/dynamic-table.interface";
import { MaybeNull } from "./../../../interface/app.types";
import { TypeEditorComponent } from "./components/type-editor/type-editor.component";
import {
    DataSchemaTypeOption,
    SchemaField,
    TIMEZONE_OPTIONS_LIST,
    TimezoneTimestampOption,
    TYPES_OPTIONS_LIST,
    UNIT_OPTIONS_LIST,
    UnitTimestampOption,
} from "./edit-schema-table.types";

@Component({
    selector: "app-edit-schema-table",
    imports: [
        //-----//

        NgIf,
        FormsModule,
        JsonPipe,
        //-----//
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        ClipboardModule,
        ToastrModule,
        NgSelectModule,

        //-----//
        TypeEditorComponent,
    ],
    templateUrl: "./edit-schema-table.component.html",
    styleUrl: "./edit-schema-table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSchemaTableComponent {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public dataRows: DataSchemaField[];
    @Input({ required: true }) public idTable: string;
    @Input({ required: true }) public columnDescriptors: DynamicTableColumnDescriptor[];

    @Output() public typeStructChangeEmitter = new EventEmitter<{ fields: DataSchemaField[]; index: number }>();

    public dataSource = new MatTableDataSource<DataSchemaField>([]);

    public readonly TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = TYPES_OPTIONS_LIST;
    public readonly UNIT_OPTIONS_LIST: UnitTimestampOption[] = UNIT_OPTIONS_LIST;
    public readonly TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = TIMEZONE_OPTIONS_LIST;
    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    public editingRow: MaybeNull<SchemaField> = null;
    public editingIndex: MaybeNull<number> = null;
    public addingField: boolean = false;

    public ngOnInit(): void {
        this.displayTable();
    }

    public get displayedColumns(): string[] {
        return this.columnDescriptors.map((item) => item.columnName);
    }

    public get schemaTimeField(): DataSchemaTimeField {
        return this.editingRow?.type as DataSchemaTimeField;
    }

    public get schemaOptionField(): DataSchemaOptionField {
        return this.editingRow?.type as DataSchemaOptionField;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.dataRows &&
            JSON.stringify(changes.dataRows.currentValue) !== JSON.stringify(changes.dataRows.previousValue)
        ) {
            this.displayTable();
        }
    }

    public trackByColumn(index: number, item: DynamicTableColumnDescriptor): string {
        return item.columnName;
    }

    private displayTable(): void {
        if (this.displayedColumns.length === 0) {
            this.dataSource.data = [];
        } else {
            this.dataSource.data = this.dataRows;
        }
    }

    public editRow(element: DataSchemaField, index: number): void {
        this.editingRow = JSON.parse(JSON.stringify(element));
        this.editingIndex = index;
    }

    public deleteRow(rowIndex: number): void {
        const updatedData = this.dataSource.data.filter((_, i) => i !== rowIndex);
        this.dataSource.data = updatedData;
    }

    public saveEditing(indexRow: number): void {
        if (this.editingRow) {
            const updatedData = [...this.dataSource.data];

            updatedData[indexRow] = this.editingRow;
            this.dataSource.data = updatedData;
        }

        this.resetEditing();
    }

    public cancelEditing(): void {
        this.resetEditing();
        if (this.addingField) {
            const currentData = [...this.dataSource.data];
            currentData.pop();
            this.dataSource.data = currentData;
            this.addingField = false;
        }
    }

    public odfType2String(element: DataSchemaField): string {
        return odfType2String(element.type);
    }

    private resetEditing(): void {
        this.editingRow = null;
        this.editingIndex = null;
    }

    public typeChangeHandle(event: DataSchemaTypeField): void {
        if (this.editingRow) {
            this.editingRow.type = event;
        }
    }

    public schemaData(schema: DataSchemaField[]): DataSchemaField[] {
        console.log("2222schema====", schema);
        return schemaEditAsDataRows(schema);
    }

    public typeStructChange(event: { fields: DataSchemaField[]; index: number }): void {
        const updatedData = [...this.dataSource.data];

        (updatedData[event.index].type as DataSchemaStructField).fields = event.fields;
        this.dataSource.data = updatedData;
    }

    public startAddField(): void {
        this.addingField = true;
        this.dataSource.data = [...this.dataSource.data, { name: "newField", type: { kind: OdfTypes.String } }];
        this.editingRow = { name: "newField", type: { kind: OdfTypes.String } };
        this.editingIndex = this.dataSource.data.length - 1;
    }
}
