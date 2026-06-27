/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ClipboardModule } from "@angular/cdk/clipboard";
import { JsonPipe, NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";

import { AutoFocusDirective } from "@common/directives/auto-focus.directive";
import { odfType2String, schemaEditAsDataRows } from "@common/helpers/data-schema.helpers";
import { MaybeNull } from "@interface/app.types";
import {
    DataSchemaField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { BaseComponent } from "../base.component";
import { DynamicTableColumnDescriptor } from "../dynamic-table/dynamic-table.interface";
import { TypeEditorComponent } from "./components/type-editor/type-editor.component";
import {
    ChangeStructType,
    DataSchemaTypeOption,
    EditSchemaView,
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
        NgbNavModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        ClipboardModule,
        ToastrModule,
        NgSelectModule,

        //-----//
        TypeEditorComponent,
        AutoFocusDirective,
    ],
    templateUrl: "./edit-schema-table.component.html",
    styleUrl: "./edit-schema-table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSchemaTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() public form: FormGroup;
    @Input() public controlName: string;
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public dataRows: DataSchemaField[];
    @Input({ required: true }) public idTable: string;
    @Input({ required: true }) public columnDescriptors: DynamicTableColumnDescriptor[];

    @Output() public dataRowsChange = new EventEmitter<ChangeStructType>();

    private schemaService = inject(EditSchemaTableService);
    private fb = inject(FormBuilder);

    public dataSource = new MatTableDataSource<DataSchemaField>([]);

    public readonly TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = TYPES_OPTIONS_LIST;
    public readonly UNIT_OPTIONS_LIST: UnitTimestampOption[] = UNIT_OPTIONS_LIST;
    public readonly TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = TIMEZONE_OPTIONS_LIST;
    public readonly OdfTypes: typeof OdfTypes = OdfTypes;
    public readonly EditSchemaView: typeof EditSchemaView = EditSchemaView;
    public currentSchemaView: EditSchemaView = EditSchemaView.SCHEMA;
    public editingStructFieldName = "";

    public get editingRow(): MaybeNull<DataSchemaField> {
        return this.schemaService.editingRow;
    }

    public get editingStructRow(): MaybeNull<DataSchemaField> {
        return this.schemaService.editingStructRow;
    }

    public get structField(): MaybeNull<DataSchemaStructField> {
        return this.schemaService?.editingStructRow?.type as DataSchemaStructField;
    }

    public get structFieldName(): string {
        return this.schemaService?.editingStructRow?.name as string;
    }

    public get editingIndex() {
        return this.schemaService.editingIndex;
    }
    public get addingField() {
        return this.schemaService.addingField;
    }

    public ngOnInit(): void {
        this.schemaService.resetEditing();
        this.schemaService.dataRows$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((rows) => {
            this.dataSource.data = rows;
        });
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
        if (this.schemaService.editingRow && !this.schemaService.editingRow.name) {
            this.schemaService.saveEditing(this.schemaService.editingIndex as number);
        } else {
            if (element.type.kind === OdfTypes.Struct) {
                this.currentSchemaView = EditSchemaView.STRUCT;
                this.editingStructFieldName = element.name;
            }
            this.schemaService.editRow(element, index);
        }
    }

    public deleteRow(rowIndex: number): void {
        this.schemaService.deleteRow(rowIndex);
        (this.form.controls.schema as FormArray).removeAt(rowIndex);
    }

    public saveEditing(indexRow: number): void {
        this.schemaService.saveEditing(indexRow);

        if (this.schemaService.addingField && this.form) {
            const schemaControl = this.form.controls.schema as FormArray;
            schemaControl.push(
                new FormGroup({
                    name: new FormControl(""),
                    type: new FormControl(OdfTypes.String),
                }),
            );
            schemaControl.setValue(this.schemaService.currentData);
            this.schemaService.setDataRows(schemaControl.value);
            this.schemaService.addingField = false;
        }
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

    public startAddField(): void {
        this.schemaService.startAddField();
    }

    public get disabledAddFieldButton(): boolean {
        return Boolean(this.schemaService.editingRow);
    }

    public onNavChange(event: NgbNavChangeEvent, index: number): void {
        const nextNav = event.nextId as EditSchemaView;

        (this.editingStructRow?.type as DataSchemaStructField).fields = this.schemaService.currentData;
        this.dataRowsChange.emit({
            data: this.editingStructRow as DataSchemaField,
            index: this.schemaService.editingStructRowIndex as number,
        });

        this.schemaService.setDataRows(this.form.controls.schema.value);
        this.currentSchemaView = nextNav;
    }
}
