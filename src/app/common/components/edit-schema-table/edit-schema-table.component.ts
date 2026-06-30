/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";

import { AutoFocusDirective } from "@common/directives/auto-focus.directive";
import { odfType2String } from "@common/helpers/data-schema.helpers";
import { MaybeNull } from "@interface/app.types";
import {
    DataSchemaField,
    DataSchemaStructField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { TypeEditorComponent } from "./components/type-editor/type-editor.component";

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
        NgSelectModule,
        //-----//
        TypeEditorComponent,
        AutoFocusDirective,
        forwardRef(() => EditSchemaTableComponent),
    ],
    templateUrl: "./edit-schema-table.component.html",
    styleUrl: "./edit-schema-table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSchemaTableComponent implements OnChanges {
    @Input({ required: true }) public fields: DataSchemaField[] = [];
    @Input() public depth: number = 0;
    @Input() public tablePath: string = "root";
    @Output() public fieldsChange = new EventEmitter<DataSchemaField[]>();

    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    public dataSource = new MatTableDataSource<DataSchemaField>([]);

    public readonly displayedColumns = ["name", "type"];

    public editingIndex: MaybeNull<number> = null;
    public addingField = false;
    public editingRow: MaybeNull<DataSchemaField> = null;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.fields) {
            this.dataSource.data = this.fields ?? [];
        }
    }

    public get disabledAddFieldButton(): boolean {
        return this.editingIndex !== null;
    }

    public odfType2String(element: DataSchemaField): string {
        return odfType2String(element.type);
    }

    public isStruct(field: DataSchemaField): boolean {
        return field.type.kind === OdfTypes.Struct;
    }

    public structFields(field: DataSchemaField): DataSchemaField[] {
        return (field.type as DataSchemaStructField).fields as DataSchemaField[];
    }

    public editRow(element: DataSchemaField, index: number): void {
        if (this.editingRow && !this.editingRow.name) {
            this.saveEditing(this.editingIndex as number);
            return;
        }
        this.editingRow = { ...element, type: { ...element.type } };
        this.editingIndex = index;
    }

    public deleteRow(rowIndex: number): void {
        const updated = this.fields.filter((_, i) => i !== rowIndex);
        this.fieldsChange.emit(updated);
    }

    public saveEditing(indexRow: number): void {
        if (!this.editingRow || !this.editingRow.name) {
            return;
        }
        const saved = this.editingRow;
        const updated = this.fields.map((f, i) => (i === indexRow ? { ...saved } : f));
        this.addingField = false;
        this.editingRow = null;
        this.editingIndex = null;
        this.fieldsChange.emit(updated);
    }

    public cancelEditing(): void {
        if (this.addingField) {
            const updated = this.fields.filter((_, i) => i !== this.editingIndex);
            this.addingField = false;
            this.editingRow = null;
            this.editingIndex = null;
            this.fieldsChange.emit(updated);
        } else {
            this.editingRow = null;
            this.editingIndex = null;
        }
    }

    public startAddField(): void {
        const newField: DataSchemaField = { name: "", type: { kind: OdfTypes.String } };
        const updated = [...this.fields, newField];
        this.addingField = true;
        this.editingRow = { ...newField };
        this.editingIndex = updated.length - 1;
        this.fieldsChange.emit(updated);
    }

    public typeChangeHandle(event: DataSchemaTypeField): void {
        if (this.editingRow) {
            this.editingRow = { ...this.editingRow, type: { ...event } };
        }
    }

    public nestedTablePath(fieldName: string): string {
        return `${this.tablePath}.${fieldName}`;
    }

    public onNestedFieldsChange(parentIndex: number, nestedFields: DataSchemaField[]): void {
        const parent = this.fields[parentIndex];
        const updatedType: DataSchemaStructField = {
            ...(parent.type as DataSchemaStructField),
            fields: nestedFields,
        };
        const updated = this.fields.map((f, i) => (i === parentIndex ? { ...f, type: updatedType } : f));
        this.fieldsChange.emit(updated);
    }
}
