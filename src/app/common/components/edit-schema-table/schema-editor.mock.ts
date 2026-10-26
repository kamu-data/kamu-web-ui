/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/**
 * Shared fixtures for the schema-editor test suites (Iteration 2).
 *
 * ORDER_SCHEMA exercises every compound type shape that the simple Phase 8
 * fixtures never covered: Option, List<scalar>, Map, sibling Structs at the
 * same level, a 3-level nested Struct, and a List<Struct> item type.
 *
 * Schema shape:
 *
 *   order_id     Int64
 *   placed_at    Timestamp<Millisecond, UTC>
 *   notes        Option<String>
 *   tags         List<String>
 *   attributes   Map<String, String>
 *   customer     Struct
 *     customer_id  Int64
 *     name         String
 *     address      Struct
 *       street     String
 *       geo        Struct
 *         lat      Float64
 *         lng      Float64
 *   items        List<Struct<sku:String, qty:Int32>>
 *   shipping     Struct
 *     carrier    String
 *     tracking   Option<String>
 */

import { ComponentFixture } from "@angular/core/testing";

import { NgOption, NgSelectComponent } from "@ng-select/ng-select";
import { parse } from "yaml";

import { MaybeNullOrUndefined, MaybeUndefined } from "@interface/app.types";
import {
    DataSchemaField,
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    DatasetSchema,
    OdfTypes,
} from "@interface/dataset-schema.interface";

// ---------------------------------------------------------------------------
// ORDER_SCHEMA — canonical DataSchemaField[] form
// ---------------------------------------------------------------------------

export const ORDER_SCHEMA: DataSchemaField[] = [
    { name: "order_id", type: { kind: OdfTypes.Int64 } },
    { name: "placed_at", type: { kind: OdfTypes.Timestamp, unit: "Millisecond", timezone: "UTC" } },
    { name: "notes", type: { kind: OdfTypes.Option, inner: { kind: OdfTypes.String } } },
    { name: "tags", type: { kind: OdfTypes.List, itemType: { kind: OdfTypes.String } } },
    {
        name: "attributes",
        type: { kind: OdfTypes.Map, keyType: { kind: OdfTypes.String }, valueType: { kind: OdfTypes.String } },
    },
    {
        name: "customer",
        type: {
            kind: OdfTypes.Struct,
            fields: [
                { name: "customer_id", type: { kind: OdfTypes.Int64 } },
                { name: "name", type: { kind: OdfTypes.String } },
                {
                    name: "address",
                    type: {
                        kind: OdfTypes.Struct,
                        fields: [
                            { name: "street", type: { kind: OdfTypes.String } },
                            {
                                name: "geo",
                                type: {
                                    kind: OdfTypes.Struct,
                                    fields: [
                                        { name: "lat", type: { kind: OdfTypes.Float64 } },
                                        { name: "lng", type: { kind: OdfTypes.Float64 } },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
    {
        name: "items",
        type: {
            kind: OdfTypes.List,
            itemType: {
                kind: OdfTypes.Struct,
                fields: [
                    { name: "sku", type: { kind: OdfTypes.String } },
                    { name: "qty", type: { kind: OdfTypes.Int32 } },
                ],
            },
        },
    },
    {
        name: "shipping",
        type: {
            kind: OdfTypes.Struct,
            fields: [
                { name: "carrier", type: { kind: OdfTypes.String } },
                { name: "tracking", type: { kind: OdfTypes.Option, inner: { kind: OdfTypes.String } } },
            ],
        },
    },
];

// ---------------------------------------------------------------------------
// ORDER_SCHEMA_ODF_JSON — { fields } object form used by GQL / YAML builders
// ---------------------------------------------------------------------------

export const ORDER_SCHEMA_DATASET: DatasetSchema = { fields: ORDER_SCHEMA };

export const ORDER_SCHEMA_ODF_JSON: string = JSON.stringify(ORDER_SCHEMA_DATASET);

// ---------------------------------------------------------------------------
// ORDER_SCHEMA_LEGACY_FLAT — bare DataSchemaField[] (no { fields } wrapper)
// Used to verify that normalizeSchemaFields handles the already-normalized
// array form (idempotent path), mirroring the Phase 8 fixture pattern.
// ---------------------------------------------------------------------------

export const ORDER_SCHEMA_LEGACY_FLAT: DataSchemaField[] = ORDER_SCHEMA;

// ---------------------------------------------------------------------------
// Reading a schema back from a serialized event
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSchemaType(value: unknown): value is DataSchemaTypeField {
    if (!isRecord(value) || !Object.values<unknown>(OdfTypes).includes(value.kind)) {
        return false;
    }
    switch (value.kind) {
        case OdfTypes.Option:
            return isSchemaType(value.inner);
        case OdfTypes.List:
            return isSchemaType(value.itemType);
        case OdfTypes.Map:
            return isSchemaType(value.keyType) && isSchemaType(value.valueType);
        case OdfTypes.Struct:
            return Array.isArray(value.fields) && value.fields.every(isSchemaField);
        case OdfTypes.Timestamp:
        case OdfTypes.Duration:
        case OdfTypes.Time:
            return typeof value.unit === "string";
        default:
            return true;
    }
}

function isSchemaField(value: unknown): value is DataSchemaField {
    return isRecord(value) && typeof value.name === "string" && isSchemaType(value.type);
}

/** Parses an event YAML and returns its `content.read.schema`, whatever its shape. */
export function readSchemaOf(yaml: string): unknown {
    const event: unknown = parse(yaml);
    if (!isRecord(event) || !isRecord(event.content) || !isRecord(event.content.read)) {
        throw new Error(`Expected an event with content.read, got: ${yaml}`);
    }
    return event.content.read.schema;
}

/** Returns the value as a schema in the `{ fields }` form; throws when any field does not fit `DataSchemaField`. */
export function requireDatasetSchema(value: unknown): DatasetSchema {
    if (!isRecord(value) || !Array.isArray(value.fields) || !value.fields.every(isSchemaField)) {
        throw new Error(`Expected a { fields } schema, got: ${JSON.stringify(value)}`);
    }
    return { fields: value.fields };
}

// ---------------------------------------------------------------------------
// Narrowing a schema type to the member a test reads
// ---------------------------------------------------------------------------

function unexpectedType(expected: string, type: MaybeNullOrUndefined<DataSchemaTypeField>): Error {
    return new Error(`Expected ${expected} type, got ${JSON.stringify(type)}`);
}

export function requireTimeField(type: MaybeNullOrUndefined<DataSchemaTypeField>): DataSchemaTimeField {
    if (type?.kind !== OdfTypes.Timestamp && type?.kind !== OdfTypes.Time && type?.kind !== OdfTypes.Duration) {
        throw unexpectedType("a Timestamp, Time or Duration", type);
    }
    return type;
}

export function requireOptionField(type: MaybeNullOrUndefined<DataSchemaTypeField>): DataSchemaOptionField {
    if (type?.kind !== OdfTypes.Option) {
        throw unexpectedType("an Option", type);
    }
    return type;
}

export function requireListField(type: MaybeNullOrUndefined<DataSchemaTypeField>): DataSchemaListField {
    if (type?.kind !== OdfTypes.List) {
        throw unexpectedType("a List", type);
    }
    return type;
}

export function requireMapField(type: MaybeNullOrUndefined<DataSchemaTypeField>): DataSchemaMapField {
    if (type?.kind !== OdfTypes.Map) {
        throw unexpectedType("a Map", type);
    }
    return type;
}

export function requireStructField(type: MaybeNullOrUndefined<DataSchemaTypeField>): DataSchemaStructField {
    if (type?.kind !== OdfTypes.Struct) {
        throw unexpectedType("a Struct", type);
    }
    return type;
}

// ---------------------------------------------------------------------------
// Driving ng-select, which has no CDK harness
// ---------------------------------------------------------------------------

/**
 * Selects the option with the given value through NgSelectComponent's public API (open, then select),
 * which avoids the DOM timing of its option panel. Throws when no option has that value.
 */
export function selectNgSelectOption<T>(
    fixture: ComponentFixture<T>,
    ngSelect: NgSelectComponent,
    value: unknown,
): void {
    ngSelect.open();
    fixture.detectChanges();
    const item: MaybeUndefined<NgOption> = ngSelect.itemsList.findItem(value);
    if (!item) throw new Error(`ng-select option not found: ${JSON.stringify(value)}`);
    ngSelect.select(item);
    fixture.detectChanges();
}
