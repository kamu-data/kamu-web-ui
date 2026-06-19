/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, SimpleChanges } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { BaseComponent } from "../base.component";
import { DynamicTableColumnDescriptor } from "../dynamic-table/dynamic-table.interface";
import { TypeEditorComponent } from "./components/type-editor/type-editor.component";
import {
    DataSchemaTypeOption,
    TIMEZONE_OPTIONS_LIST,
    TimezoneTimestampOption,
    TYPES_OPTIONS_LIST,
    UNIT_OPTIONS_LIST,
    UnitTimestampOption,
} from "./edit-schema-table.types";
import { EditSchemaTableService } from "./service/edit-schema-table.service";

@Component({
    selector: "app-edit-schema-table",
    imports: [
        //-----//

        NgIf,
        FormsModule,
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
export class EditSchemaTableComponent extends BaseComponent {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public dataRows: DataSchemaField[];
    @Input({ required: true }) public idTable: string;
    @Input({ required: true }) public columnDescriptors: DynamicTableColumnDescriptor[];

    @Output() public typeStructChangeEmitter = new EventEmitter<{ fields: DataSchemaField[]; index: number }>();

    public schemaService = inject(EditSchemaTableService);

    public dataSource = new MatTableDataSource<DataSchemaField>([]);

    public readonly TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = TYPES_OPTIONS_LIST;
    public readonly UNIT_OPTIONS_LIST: UnitTimestampOption[] = UNIT_OPTIONS_LIST;
    public readonly TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = TIMEZONE_OPTIONS_LIST;
    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    public get editingRow() {
        return this.schemaService.editingRow;
    }
    public get editingIndex() {
        return this.schemaService.editingIndex;
    }
    public get addingField() {
        return this.schemaService.addingField;
    }

    public ngOnInit(): void {
        this.schemaService.dataRows$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((rows) => {
            this.dataSource.data = rows;
        });

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
            this.schemaService.setDataRows([]);
        } else {
            this.schemaService.setDataRows(this.dataRows);
        }
    }

    public editRow(element: DataSchemaField, index: number): void {
        this.schemaService.editRow(element, index);
    }

    public deleteRow(rowIndex: number): void {
        this.schemaService.deleteRow(rowIndex);
    }

    public saveEditing(indexRow: number): void {
        this.schemaService.saveEditing(indexRow);
    }

    public cancelEditing(): void {
        this.schemaService.cancelEditing();
    }

    public odfType2String(element: DataSchemaField): string {
        return odfType2String(element.type);
    }

    public typeChangeHandle(event: DataSchemaTypeField): void {
        this.schemaService.typeChangeHandle(event);
    }

    public schemaData(schema: DataSchemaField[]): DataSchemaField[] {
        return schemaEditAsDataRows(schema);
    }

    public typeStructChange(event: { fields: DataSchemaField[]; index: number }): void {
        this.schemaService.typeStructChange(event);
    }

    public startAddField(): void {
        this.schemaService.startAddField();
    }
}
