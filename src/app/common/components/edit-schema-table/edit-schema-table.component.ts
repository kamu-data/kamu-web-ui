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
    QueryList,
    SimpleChanges,
    ViewChildren,
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
import { EditSchemaEditingCoordinator } from "./edit-schema-table.types";
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
    @Input() public parentDragDisabled = false;
    @Input() public editingCoordinator?: EditSchemaEditingCoordinator;
    /** Hard errors from validateSchemaFields, scoped to this table's path prefix. */
    @Input() public errors: SchemaValidationError[] = [];
    /** Non-blocking warnings from schemaNameWarnings, scoped to this table's path prefix. */
    @Input() public warnings: SchemaWarning[] = [];
    @Output() public fieldsChange = new EventEmitter<DataSchemaField[]>();
    @Output() public editingStateChange = new EventEmitter<boolean>();

    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    public dataSource = new MatTableDataSource<DataSchemaField>([]);

    public readonly displayedColumns = ["name", "type"];

    public editingIndex: MaybeNull<number> = null;
    public addingField = false;
    public editingRow: MaybeNull<DataSchemaField> = null;
    @ViewChildren("nestedEditSchemaTable")
    private readonly nestedEditSchemaTables?: QueryList<EditSchemaTableComponent>;
    @ViewChildren("typeEditor") private readonly typeEditors?: QueryList<TypeEditorComponent>;
    private readonly localEditingCoordinator: EditSchemaEditingCoordinator = {
        flushEditing: () => this.flushEditing(),
    };
    private readonly nestedEditingTables = new Set<string>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.fields) {
            this.dataSource.data = this.fields ?? [];
        }
    }

    public get disabledAddFieldButton(): boolean {
        return this.editingRow !== null && !this.editingRow.name;
    }

    /** Dragging is disabled while any row (including a blank add-row) is being edited. */
    public get dragDisabled(): boolean {
        return this.parentDragDisabled || this.hasActiveEditing;
    }

    public get activeEditingCoordinator(): EditSchemaEditingCoordinator {
        return this.editingCoordinator ?? this.localEditingCoordinator;
    }

    public dropField(event: CdkDragDrop<DataSchemaField[]>): void {
        if (event.previousIndex === event.currentIndex) return;
        const updated = [...this.fields];
        moveItemInArray(updated, event.previousIndex, event.currentIndex);
        this.emitFieldsChange(updated);
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

    public isEmptyStruct(field: DataSchemaField): boolean {
        return field.type.kind === OdfTypes.Struct && field.type.fields.length === 0;
    }

    public editRow(element: DataSchemaField, index: number): void {
        const discarded = this.discardBlankAddRowIfPresent(index);
        if (discarded) {
            this.emitFieldsChange(discarded.fields);
            this.emitEditingState();
        }
        const targetIndex = discarded?.adjustedIndex ?? index;

        if (!this.activeEditingCoordinator.flushEditing()) {
            return;
        }

        const target = this.fields[targetIndex] ?? element;
        this.editingRow = { ...target, type: { ...target.type } };
        this.editingIndex = targetIndex;
        this.emitEditingState();
    }

    public deleteRow(rowIndex: number): void {
        const indexToDelete = this.prepareFieldsForDelete(rowIndex);
        if (indexToDelete === null) return;
        const updated = this.fields.filter((_, i) => i !== indexToDelete);
        this.emitFieldsChange(updated);
    }

    public saveEditing(indexRow: number): void {
        if (!this.flushEditingChildren()) {
            return;
        }

        if (!this.editingRow || !this.editingRow.name) {
            return;
        }
        const saved = this.editingRow;
        const updated = this.fields.map((f, i) => (i === indexRow ? { ...saved } : f));
        this.clearEditingState();
        this.emitFieldsChange(updated);
        this.emitEditingState();
    }

    public cancelEditing(): void {
        if (this.addingField) {
            const updated = this.fields.filter((_, i) => i !== this.editingIndex);
            this.clearEditingState();
            this.emitFieldsChange(updated);
        } else {
            this.clearEditingState();
        }
        this.emitEditingState();
    }

    public startAddField(): void {
        if (!this.activeEditingCoordinator.flushEditing()) {
            return;
        }
        const newField: DataSchemaField = { name: "", type: { kind: OdfTypes.String } };
        const updated = [...this.fields, newField];
        this.addingField = true;
        this.editingRow = { ...newField };
        this.editingIndex = updated.length - 1;
        this.emitFieldsChange(updated);
        this.emitEditingState();
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
        this.emitFieldsChange(updated);
    }

    public onNestedEditingStateChange(tablePath: string, editing: boolean): void {
        if (editing) {
            this.nestedEditingTables.add(tablePath);
        } else {
            this.nestedEditingTables.delete(tablePath);
        }
        this.emitEditingState();
    }

    public trackByNestedStructPath(_index: number, table: NestedStructTable): string {
        return table.path.join(".");
    }

    public flushEditing(): boolean {
        if (!this.flushEditingChildren()) {
            return false;
        }
        if (this.editingIndex === null) {
            return true;
        }
        return this.commitEditingRow();
    }

    private get hasActiveEditing(): boolean {
        return this.editingIndex !== null || this.nestedEditingTables.size > 0;
    }

    private emitEditingState(): void {
        this.editingStateChange.emit(this.hasActiveEditing);
    }

    private flushEditingChildren(): boolean {
        let flushed = true;
        this.typeEditors?.forEach((typeEditor) => {
            flushed = typeEditor.flushEditing() && flushed;
        });
        this.nestedEditSchemaTables?.forEach((nestedTable) => {
            flushed = nestedTable.flushEditing() && flushed;
        });
        return flushed;
    }

    private commitEditingRow(): boolean {
        const updated = this.fieldsWithCommittedEditingRow();
        if (!updated) return false;

        this.clearEditingState();
        this.emitFieldsChange(updated);
        this.emitEditingState();
        return true;
    }

    private applyFields(fields: DataSchemaField[]): void {
        this.fields = fields;
        this.dataSource.data = fields;
    }

    private emitFieldsChange(fields: DataSchemaField[]): void {
        this.applyFields(fields);
        this.fieldsChange.emit(fields);
    }

    private clearEditingState(): void {
        this.addingField = false;
        this.editingRow = null;
        this.editingIndex = null;
    }

    private prepareFieldsForDelete(rowIndex: number): MaybeNull<number> {
        const discarded = this.discardBlankAddRowIfPresent(rowIndex);
        if (discarded) {
            this.applyFields(discarded.fields);
            this.emitEditingState();
            return discarded.adjustedIndex;
        }

        if (!this.activeEditingCoordinator.flushEditing()) {
            return null;
        }

        return rowIndex;
    }

    /**
     * If a blank in-progress "add field" row is present, removes it from `fields`, clears editing
     * state, and returns the updated fields plus `targetIndex` adjusted for the removed row.
     * Returns `null` when there is no blank add-row to discard.
     */
    private discardBlankAddRowIfPresent(
        targetIndex: number,
    ): MaybeNull<{ fields: DataSchemaField[]; adjustedIndex: number }> {
        if (!this.addingField || this.editingIndex === null || this.editingRow?.name) {
            return null;
        }
        const blankIndex = this.editingIndex;
        const fields = this.fields.filter((_, fieldIndex) => fieldIndex !== blankIndex);
        this.clearEditingState();
        return { fields, adjustedIndex: targetIndex > blankIndex ? targetIndex - 1 : targetIndex };
    }

    private fieldsWithCommittedEditingRow(): MaybeNull<DataSchemaField[]> {
        if (!this.editingRow || this.editingIndex === null || !this.editingRow.name) return null;
        const saved = this.editingRow;
        return this.fields.map((field, index) => (index === this.editingIndex ? { ...saved } : field));
    }

    private collectNestedStructTables(
        type: DataSchemaTypeField,
        path: string[],
    ): Omit<NestedStructTable, "tablePath">[] {
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
