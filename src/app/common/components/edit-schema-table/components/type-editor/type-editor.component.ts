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
    HostBinding,
    Input,
    Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgSelectModule } from "@ng-select/ng-select";

import {
    DataSchemaField,
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { EditSchemaTableComponent } from "../../edit-schema-table.component";
import {
    DataSchemaTypeOption,
    TIMEZONE_OPTIONS_LIST,
    TimezoneTimestampOption,
    TYPES_OPTIONS_LIST,
    UNIT_OPTIONS_LIST,
    UnitTimestampOption,
} from "../../edit-schema-table.types";

@Component({
    selector: "app-type-editor",
    imports: [NgIf, FormsModule, NgSelectModule, TypeEditorComponent, forwardRef(() => EditSchemaTableComponent)],
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

    public readonly TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = TYPES_OPTIONS_LIST;
    public readonly UNIT_OPTIONS_LIST: UnitTimestampOption[] = UNIT_OPTIONS_LIST;
    public readonly TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = TIMEZONE_OPTIONS_LIST;
    public readonly OdfTypes: typeof OdfTypes = OdfTypes;

    // Retains the last-known value for each complex kind so switching away and back
    // within the same edit session restores the prior sub-config instead of losing it.
    private readonly complexCache = new Map<OdfTypes, DataSchemaTypeField>();

    public get optional(): boolean {
        return this.value.kind === OdfTypes.Option;
    }

    public get selectedKind(): OdfTypes {
        return this.baseValue.kind;
    }

    public get schemaTimeField(): DataSchemaTimeField {
        return this.baseValue as DataSchemaTimeField;
    }

    public get schemaListField(): DataSchemaListField {
        return this.baseValue as DataSchemaListField;
    }

    public get schemaMapField(): DataSchemaMapField {
        return this.baseValue as DataSchemaMapField;
    }

    public get schemaStructField(): DataSchemaStructField {
        return this.baseValue as DataSchemaStructField;
    }

    public isComplexType(kind: OdfTypes): boolean {
        return [OdfTypes.List, OdfTypes.Map, OdfTypes.Struct].includes(kind);
    }

    public changeEditorType(event: DataSchemaTypeOption): void {
        const kind = event.value;
        const complexKinds = [OdfTypes.Struct, OdfTypes.List, OdfTypes.Map];
        const currentBaseValue = this.baseValue;

        // Cache the current value before switching away from a complex kind.
        if (complexKinds.includes(currentBaseValue.kind)) {
            this.complexCache.set(currentBaseValue.kind, currentBaseValue);
        }

        let nextValue: DataSchemaTypeField;
        if ([OdfTypes.Time, OdfTypes.Duration].includes(kind)) {
            nextValue = {
                kind: kind as OdfTypes.Time | OdfTypes.Duration,
                unit: "Millisecond",
            };
        } else if (kind === OdfTypes.Timestamp) {
            nextValue = {
                kind,
                unit: "Millisecond",
                timezone: "UTC",
            };
        } else if (kind === OdfTypes.List) {
            nextValue = (this.complexCache.get(OdfTypes.List) as DataSchemaListField | undefined) ?? {
                kind,
                itemType: { kind: OdfTypes.String },
            };
        } else if (kind === OdfTypes.Map) {
            nextValue = (this.complexCache.get(OdfTypes.Map) as DataSchemaMapField | undefined) ?? {
                kind,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            };
        } else if (kind === OdfTypes.Struct) {
            nextValue = (this.complexCache.get(OdfTypes.Struct) as DataSchemaStructField | undefined) ?? {
                kind,
                fields: [],
            };
        } else {
            // Primitive / scalar kinds
            nextValue = { kind } as DataSchemaTypeField;
        }
        this.emitBaseValue(nextValue);
    }

    public changeOptional(optional: boolean): void {
        if (optional === this.optional) return;

        this.value = optional
            ? { kind: OdfTypes.Option, inner: this.value }
            : (this.value as DataSchemaOptionField).inner;
        this.typeChange.emit(this.value);
    }

    public changeUnitTime(event: UnitTimestampOption): void {
        this.emitBaseValue({ ...this.baseValue, unit: event.value } as DataSchemaTimeField);
    }

    public changeTimezone(event: TimezoneTimestampOption): void {
        this.emitBaseValue({ ...this.baseValue, timezone: event.value } as DataSchemaTimeField);
    }

    public typeOptionChange(event: DataSchemaTypeField): void {
        this.emitBaseValue(event);
    }

    public typeListChange(event: DataSchemaTypeField): void {
        this.emitBaseValue({ ...this.baseValue, itemType: event } as DataSchemaListField);
    }

    public typeMapValueChange(event: DataSchemaTypeField): void {
        this.emitBaseValue({ ...this.baseValue, valueType: event } as DataSchemaMapField);
    }

    public typeMapKeyChange(event: DataSchemaTypeField): void {
        this.emitBaseValue({ ...this.baseValue, keyType: event } as DataSchemaMapField);
    }

    public typeStructFieldsChange(fields: DataSchemaField[]): void {
        this.value = this.wrapOptional({ ...this.baseValue, fields } as DataSchemaStructField);
        this.typeChange.emit(this.value);
    }

    private get baseValue(): DataSchemaTypeField {
        return this.value.kind === OdfTypes.Option ? this.value.inner : this.value;
    }

    private emitBaseValue(value: DataSchemaTypeField): void {
        this.value = this.wrapOptional(value);
        this.typeChange.emit(this.value);
    }

    private wrapOptional(value: DataSchemaTypeField): DataSchemaTypeField {
        return this.optional ? { kind: OdfTypes.Option, inner: value } : value;
    }
}
