/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgSelectModule } from "@ng-select/ng-select";

import {
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

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
    imports: [NgIf, FormsModule, NgSelectModule, TypeEditorComponent],
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

    public get schemaTimeField(): DataSchemaTimeField {
        return this.value as DataSchemaTimeField;
    }

    public isComplexType(kind: OdfTypes): boolean {
        return [OdfTypes.List, OdfTypes.Map, OdfTypes.Option].includes(kind);
    }

    public changeEditorType(event: DataSchemaTypeOption): void {
        const kind = event.value;

        // Default: strip any complex-type-specific fields; covers all simple/primitive kinds.
        this.value = { kind } as DataSchemaTypeField;

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
            this.value = {
                kind,
                inner: { kind: OdfTypes.String },
            } as DataSchemaOptionField;
        } else if (kind === OdfTypes.List) {
            this.value = {
                kind,
                itemType: { kind: OdfTypes.String },
            } as DataSchemaListField;
        } else if (kind === OdfTypes.Map) {
            this.value = {
                kind,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            } as DataSchemaMapField;
        } else if (kind === OdfTypes.Struct) {
            this.value = {
                kind,
                fields: [],
            } as DataSchemaStructField;
        }
        this.typeChange.emit(this.value);
    }

    public changeUnitTime(event: DataSchemaTypeOption): void {
        this.value = { ...this.value, unit: event.value } as DataSchemaTimeField;
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
}
