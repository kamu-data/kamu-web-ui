/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { NgFor, NgIf } from "@angular/common";
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
import { schemaNameWarnings, SchemaValidationError, SchemaWarning } from "./validation/schema-validation";

interface NestedStructTable {
    fields: DataSchemaField[];
    path: string[];
    tablePath: string;
}

@Component({
    selector: "app-edit-schema-table",
    imports: [
        //-----//
        NgFor,
        NgIf,
        FormsModule,
        //-----//
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        NgSelectModule,
        //-----//
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
        //-----//
        forwardRef(() => TypeEditorComponent),
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
    /** Hard errors from validateSchemaFields, scoped to this table's path prefix. */
    @Input() public errors: SchemaValidationError[] = [];
    /** Non-blocking warnings from schemaNameWarnings, scoped to this table's path prefix. */
    @Input() public warnings: SchemaWarning[] = [];
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

    /** Dragging is disabled while any row (including a blank add-row) is being edited. */
    public get dragDisabled(): boolean {
        return this.editingIndex !== null;
    }

    public dropField(event: CdkDragDrop<DataSchemaField[]>): void {
        if (event.previousIndex === event.currentIndex) return;
        const updated = [...this.fields];
        moveItemInArray(updated, event.previousIndex, event.currentIndex);
        this.fieldsChange.emit(updated);
    }

    public odfType2String(element: DataSchemaField): string {
        return odfType2String(element.type);
    }

    public nestedStructTables(field: DataSchemaField): NestedStructTable[] {
        return this.collectNestedStructTables(field.type, []).map((table) => ({
            ...table,
            tablePath: this.nestedTablePath(field.name, table.path),
        }));
    }

    /** Returns the leaf-level errors (path.length === 1) for a given field name at this scope. */
    public leafErrorsForField(name: string): SchemaValidationError[] {
        return this.errors.filter((e) => e.path[0] === name && e.path.length === 1);
    }

    /** Returns errors that belong to a nested struct path, stripped so the nested table can treat them as root-relative. */
    public nestedErrorsForPath(name: string, path: string[]): SchemaValidationError[] {
        const prefix = [name, ...path];
        return this.errors
            .filter((e) => prefix.every((segment, index) => e.path[index] === segment) && e.path.length > prefix.length)
            .map((e) => ({ ...e, path: e.path.slice(prefix.length) }));
    }

    /** Returns warnings for a given field name at this scope. */
    public warningsForField(name: string): SchemaWarning[] {
        return schemaNameWarnings(name);
    }

    /** Returns the tooltip text for all leaf errors on a field. */
    public errorTooltip(name: string): string {
        return this.leafErrorsForField(name)
            .map((e) => e.code)
            .join(", ");
    }

    /** Returns the tooltip text for all warnings on a field. */
    public warningTooltip(name: string): string {
        return this.warningsForField(name)
            .map((w) => w.code)
            .join(", ");
    }

    public editRow(element: DataSchemaField, index: number): void {
        if (this.editingRow && !this.editingRow.name) {
            // Blank provisional add row — discard it instead of attempting a no-op save.
            this.cancelEditing();
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

    public trackByFieldIndex(index: number, _field: DataSchemaField): number {
        return index;
    }

    public nestedTablePath(fieldName: string, path: string[] = ["fields"]): string {
        const qualifier = path.length === 1 && path[0] === "fields" ? "" : `.${path.slice(0, -1).join(".")}`;
        return `${this.tablePath}.${fieldName}${qualifier}`;
    }

    public onNestedFieldsChange(parentIndex: number, path: string[], nestedFields: DataSchemaField[]): void {
        const parent = this.fields[parentIndex];
        const updatedType = this.updateNestedStructFields(parent.type, path, nestedFields);
        const updated = this.fields.map((f, i) => (i === parentIndex ? { ...f, type: updatedType } : f));
        this.fieldsChange.emit(updated);
    }

    public trackByNestedStructPath(_index: number, table: NestedStructTable): string {
        return table.path.join(".");
    }

    private collectNestedStructTables(type: DataSchemaTypeField, path: string[]): Omit<NestedStructTable, "tablePath">[] {
        switch (type.kind) {
            case OdfTypes.Struct:
                return [{ fields: type.fields as DataSchemaField[], path: [...path, "fields"] }];
            case OdfTypes.Option:
                return this.collectNestedStructTables(type.inner, [...path, "inner"]);
            case OdfTypes.List:
                return this.collectNestedStructTables(type.itemType, [...path, "itemType"]);
            case OdfTypes.Map:
                return [
                    ...this.collectNestedStructTables(type.keyType, [...path, "keyType"]),
                    ...this.collectNestedStructTables(type.valueType, [...path, "valueType"]),
                ];
            default:
                return [];
        }
    }

    private updateNestedStructFields(
        type: DataSchemaTypeField,
        path: string[],
        nestedFields: DataSchemaField[],
    ): DataSchemaTypeField {
        const [segment, ...rest] = path;
        switch (segment) {
            case "fields":
                return { ...(type as DataSchemaStructField), fields: nestedFields };
            case "inner":
                return type.kind === OdfTypes.Option
                    ? { ...type, inner: this.updateNestedStructFields(type.inner, rest, nestedFields) }
                    : type;
            case "itemType":
                return type.kind === OdfTypes.List
                    ? { ...type, itemType: this.updateNestedStructFields(type.itemType, rest, nestedFields) }
                    : type;
            case "keyType":
                return type.kind === OdfTypes.Map
                    ? { ...type, keyType: this.updateNestedStructFields(type.keyType, rest, nestedFields) }
                    : type;
            case "valueType":
                return type.kind === OdfTypes.Map
                    ? { ...type, valueType: this.updateNestedStructFields(type.valueType, rest, nestedFields) }
                    : type;
            default:
                return type;
        }
    }
}
