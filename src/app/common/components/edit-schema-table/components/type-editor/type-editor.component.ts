/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostBinding, Input, Output } from "@angular/core";
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

    public get schemaTimeField(): DataSchemaTimeField {
        return this.value as DataSchemaTimeField;
    }

    public get schemaStructField(): DataSchemaStructField {
        return this.value as DataSchemaStructField;
    }

    public isComplexType(kind: OdfTypes): boolean {
        return [OdfTypes.List, OdfTypes.Map, OdfTypes.Option].includes(kind);
    }

    public changeEditorType(event: DataSchemaTypeOption): void {
        const kind = event.value;
        const complexKinds = [OdfTypes.Struct, OdfTypes.List, OdfTypes.Map, OdfTypes.Option];

        // Cache the current value before switching away from a complex kind.
        if (complexKinds.includes(this.value?.kind)) {
            this.complexCache.set(this.value.kind, this.value);
        }

        if ([OdfTypes.Time, OdfTypes.Duration].includes(kind)) {
            this.value = {
                kind: kind as OdfTypes.Time | OdfTypes.Duration,
                unit: "Millisecond",
            };
        } else if (kind === OdfTypes.Timestamp) {
            this.value = {
                kind,
                unit: "Millisecond",
                timezone: "UTC",
            };
        } else if (kind === OdfTypes.Option) {
            this.value = (this.complexCache.get(OdfTypes.Option) as DataSchemaOptionField | undefined) ?? {
                kind,
                inner: { kind: OdfTypes.String },
            };
        } else if (kind === OdfTypes.List) {
            this.value = (this.complexCache.get(OdfTypes.List) as DataSchemaListField | undefined) ?? {
                kind,
                itemType: { kind: OdfTypes.String },
            };
        } else if (kind === OdfTypes.Map) {
            this.value = (this.complexCache.get(OdfTypes.Map) as DataSchemaMapField | undefined) ?? {
                kind,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            };
        } else if (kind === OdfTypes.Struct) {
            this.value = (this.complexCache.get(OdfTypes.Struct) as DataSchemaStructField | undefined) ?? {
                kind,
                fields: [],
            };
        } else {
            // Primitive / scalar kinds
            this.value = { kind } as DataSchemaTypeField;
        }
        this.typeChange.emit(this.value);
    }

    public changeUnitTime(event: UnitTimestampOption): void {
        this.value = { ...this.value, unit: event.value } as DataSchemaTimeField;
        this.typeChange.emit(this.value);
    }

    public changeTimezone(event: TimezoneTimestampOption): void {
        this.value = { ...this.value, timezone: event.value } as DataSchemaTimeField;
        this.typeChange.emit(this.value);
    }

    public typeOptionChange(event: DataSchemaTypeField): void {
        this.typeChange.emit({ ...this.value, inner: event } as DataSchemaTypeField);
    }

    public typeListChange(event: DataSchemaTypeField): void {
        this.typeChange.emit({ ...this.value, itemType: event } as DataSchemaTypeField);
    }

    public typeMapValueChange(event: DataSchemaTypeField): void {
        this.typeChange.emit({ ...this.value, valueType: event } as DataSchemaTypeField);
    }

    public typeMapKeyChange(event: DataSchemaTypeField): void {
        this.typeChange.emit({ ...this.value, keyType: event } as DataSchemaTypeField);
    }

    public typeStructFieldsChange(fields: DataSchemaField[]): void {
        this.value = { ...this.value, fields } as DataSchemaStructField;
        this.typeChange.emit(this.value);
    }
}
