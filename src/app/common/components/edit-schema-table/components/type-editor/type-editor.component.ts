/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgSelectModule } from "@ng-select/ng-select";

import { MaybeNull } from "@interface/app.types";
import {
    DataSchemaField,
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { EditSchemaTableComponent } from "../../edit-schema-table.component";
import {
    DataSchemaTypeOption,
    SelectableOdfKind,
    TIMEZONE_OPTIONS_LIST,
    TimezoneTimestampOption,
    TYPES_OPTIONS_LIST,
    UNIT_OPTIONS_LIST,
    UnitTimestampOption,
} from "../../edit-schema-table.types";

type ComplexKind = OdfTypes.List | OdfTypes.Map | OdfTypes.Struct;

type ComplexFieldCache = { [K in ComplexKind]?: Extract<DataSchemaTypeField, { kind: K }> };

function isComplexKind(kind: OdfTypes): kind is ComplexKind {
    return kind === OdfTypes.List || kind === OdfTypes.Map || kind === OdfTypes.Struct;
}

function isTimeField(value: DataSchemaTypeField): value is DataSchemaTimeField {
    return value.kind === OdfTypes.Timestamp || value.kind === OdfTypes.Time || value.kind === OdfTypes.Duration;
}

function defaultTypeFieldOfKind(kind: SelectableOdfKind): DataSchemaTypeField {
    switch (kind) {
        case OdfTypes.Time:
        case OdfTypes.Duration:
            return { kind, unit: "Millisecond" };
        case OdfTypes.Timestamp:
            return { kind, unit: "Millisecond", timezone: "UTC" };
        case OdfTypes.List:
            return { kind, itemType: { kind: OdfTypes.String } };
        case OdfTypes.Map:
            return { kind, keyType: { kind: OdfTypes.String }, valueType: { kind: OdfTypes.String } };
        case OdfTypes.Struct:
            return { kind, fields: [] };
        case OdfTypes.Null:
            return { kind };
        case OdfTypes.Binary:
        case OdfTypes.Bool:
        case OdfTypes.Date:
        case OdfTypes.Decimal:
        case OdfTypes.Float16:
        case OdfTypes.Float32:
        case OdfTypes.Float64:
        case OdfTypes.Int8:
        case OdfTypes.Int16:
        case OdfTypes.Int32:
        case OdfTypes.Int64:
        case OdfTypes.UInt8:
        case OdfTypes.UInt16:
        case OdfTypes.UInt32:
        case OdfTypes.UInt64:
        case OdfTypes.String:
            return { kind };
    }
}

@Component({
    selector: "app-type-editor",
    imports: [
        //-----//
        FormsModule,
        //-----//
        NgSelectModule,
        //-----//
        TypeEditorComponent,
        forwardRef(() => EditSchemaTableComponent),
    ],
    templateUrl: "./type-editor.component.html",
    styleUrl: "./type-editor.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeEditorComponent {
    @Input({ required: true }) public value: DataSchemaTypeField;
    @Input() public depth: number = 0;
    @Input() public typePath: string = "type";
    // Reflected onto the host element so TypeEditorHarness can resolve the typePath at runtime
    // without receiving it as a separate constructor argument (CDK harnesses have no DI).
    @HostBinding("attr.data-test-id") public get hostTestId(): string {
        return this.typePath;
    }
    @Output() public typeChange = new EventEmitter<DataSchemaTypeField>();
    @ViewChildren("typeEditor") private readonly childTypeEditors?: QueryList<TypeEditorComponent>;
    @ViewChildren("nestedEditSchemaTable")
    private readonly nestedEditSchemaTables?: QueryList<EditSchemaTableComponent>;

    public readonly TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = TYPES_OPTIONS_LIST;
    public readonly UNIT_OPTIONS_LIST: UnitTimestampOption[] = UNIT_OPTIONS_LIST;
    public readonly TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = TIMEZONE_OPTIONS_LIST;
    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    // Retains the last-known value for each complex kind so switching away and back
    // within the same edit session restores the prior sub-config instead of losing it.
    private readonly complexCache: ComplexFieldCache = {};

    public get optional(): boolean {
        return this.value.kind === OdfTypes.Option;
    }

    public get selectedKind(): OdfTypes {
        return this.baseValue.kind;
    }

    public get schemaTimeField(): MaybeNull<DataSchemaTimeField> {
        const baseValue = this.baseValue;
        return isTimeField(baseValue) ? baseValue : null;
    }

    public get schemaListField(): MaybeNull<DataSchemaListField> {
        const baseValue = this.baseValue;
        return baseValue.kind === OdfTypes.List ? baseValue : null;
    }

    public get schemaMapField(): MaybeNull<DataSchemaMapField> {
        const baseValue = this.baseValue;
        return baseValue.kind === OdfTypes.Map ? baseValue : null;
    }

    public get schemaStructField(): MaybeNull<DataSchemaStructField> {
        const baseValue = this.baseValue;
        return baseValue.kind === OdfTypes.Struct ? baseValue : null;
    }

    public changeEditorType(event: DataSchemaTypeOption): void {
        const kind = event.value;
        this.cacheComplexValue(this.baseValue);

        const cachedValue = isComplexKind(kind) ? this.complexCache[kind] : undefined;
        this.emitBaseValue(cachedValue ?? defaultTypeFieldOfKind(kind));
    }

    public changeOptional(optional: boolean): void {
        if (optional === this.optional) return;

        this.value = optional ? { kind: OdfTypes.Option, inner: this.value } : this.baseValue;
        this.typeChange.emit(this.value);
    }

    public changeUnitTime(event: UnitTimestampOption): void {
        const timeField = this.schemaTimeField;
        if (timeField) {
            this.emitBaseValue({ ...timeField, unit: event.value });
        }
    }

    public changeTimezone(event: TimezoneTimestampOption): void {
        const timeField = this.schemaTimeField;
        if (timeField) {
            this.emitBaseValue({ ...timeField, timezone: event.value });
        }
    }

    public typeOptionChange(event: DataSchemaTypeField): void {
        this.emitBaseValue(event);
    }

    public typeListChange(event: DataSchemaTypeField): void {
        const listField = this.schemaListField;
        if (listField) {
            this.emitBaseValue({ ...listField, itemType: event });
        }
    }

    public typeMapValueChange(event: DataSchemaTypeField): void {
        const mapField = this.schemaMapField;
        if (mapField) {
            this.emitBaseValue({ ...mapField, valueType: event });
        }
    }

    public typeMapKeyChange(event: DataSchemaTypeField): void {
        const mapField = this.schemaMapField;
        if (mapField) {
            this.emitBaseValue({ ...mapField, keyType: event });
        }
    }

    public typeStructFieldsChange(fields: DataSchemaField[]): void {
        const structField = this.schemaStructField;
        if (structField) {
            this.emitBaseValue({ ...structField, fields });
        }
    }

    public flushEditing(): boolean {
        let flushed = true;
        this.childTypeEditors?.forEach((typeEditor) => {
            flushed = typeEditor.flushEditing() && flushed;
        });
        this.nestedEditSchemaTables?.forEach((nestedTable) => {
            flushed = nestedTable.flushEditing() && flushed;
        });
        return flushed;
    }

    private get baseValue(): DataSchemaTypeField {
        return this.value.kind === OdfTypes.Option ? this.value.inner : this.value;
    }

    private cacheComplexValue(value: DataSchemaTypeField): void {
        switch (value.kind) {
            case OdfTypes.List:
                this.complexCache[OdfTypes.List] = value;
                break;
            case OdfTypes.Map:
                this.complexCache[OdfTypes.Map] = value;
                break;
            case OdfTypes.Struct:
                this.complexCache[OdfTypes.Struct] = value;
                break;
            default:
                break;
        }
    }

    private emitBaseValue(value: DataSchemaTypeField): void {
        this.value = this.wrapOptional(value);
        this.typeChange.emit(this.value);
    }

    private wrapOptional(value: DataSchemaTypeField): DataSchemaTypeField {
        return this.optional ? { kind: OdfTypes.Option, inner: value } : value;
    }
}
