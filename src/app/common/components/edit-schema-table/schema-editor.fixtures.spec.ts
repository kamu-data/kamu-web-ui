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

import { DataSchemaField, DatasetSchema, OdfTypes } from "@interface/dataset-schema.interface";

import { EditSchemaTableHarness } from "./edit-schema-table.harness";

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
// Sanity assertions — these run as part of the test suite to catch any
// typo in the fixture before it silently breaks a downstream test.
// ---------------------------------------------------------------------------

describe("ORDER_SCHEMA fixture sanity", () => {
    it("has the expected top-level field names in order", () => {
        const names = ORDER_SCHEMA.map((f) => f.name);
        expect(names).toEqual([
            "order_id",
            "placed_at",
            "notes",
            "tags",
            "attributes",
            "customer",
            "items",
            "shipping",
        ]);
    });

    it("notes is Option<String>", () => {
        const notes = EditSchemaTableHarness.requireField(ORDER_SCHEMA, "notes");
        expect(notes.type.kind).toBe(OdfTypes.Option);
        if (notes.type.kind === OdfTypes.Option) {
            expect(notes.type.inner.kind).toBe(OdfTypes.String);
        }
    });

    it("tags is List<String>", () => {
        const tags = EditSchemaTableHarness.requireField(ORDER_SCHEMA, "tags");
        expect(tags.type.kind).toBe(OdfTypes.List);
        if (tags.type.kind === OdfTypes.List) {
            expect(tags.type.itemType.kind).toBe(OdfTypes.String);
        }
    });

    it("attributes is Map<String, String>", () => {
        const attrs = EditSchemaTableHarness.requireField(ORDER_SCHEMA, "attributes");
        expect(attrs.type.kind).toBe(OdfTypes.Map);
        if (attrs.type.kind === OdfTypes.Map) {
            expect(attrs.type.keyType.kind).toBe(OdfTypes.String);
            expect(attrs.type.valueType.kind).toBe(OdfTypes.String);
        }
    });

    it("customer is a 3-level Struct: customer → address → geo", () => {
        const customerFields = EditSchemaTableHarness.structFieldsOf(ORDER_SCHEMA, "customer");
        const addressFields = EditSchemaTableHarness.structFieldsOf(customerFields, "address");
        const geoFields = EditSchemaTableHarness.structFieldsOf(addressFields, "geo");
        expect(geoFields.map((f) => f.name)).toEqual(["lat", "lng"]);
    });

    it("items is List<Struct> with sku and qty fields", () => {
        const items = EditSchemaTableHarness.requireField(ORDER_SCHEMA, "items");
        expect(items.type.kind).toBe(OdfTypes.List);
        if (items.type.kind !== OdfTypes.List) return;

        const itemType = items.type.itemType;
        expect(itemType.kind).toBe(OdfTypes.Struct);
        if (itemType.kind !== OdfTypes.Struct) return;

        expect(itemType.fields.map((f) => f.name)).toEqual(["sku", "qty"]);
    });

    it("shipping is a sibling Struct to customer with Option<String> tracking", () => {
        const shippingFields = EditSchemaTableHarness.structFieldsOf(ORDER_SCHEMA, "shipping");
        const tracking = EditSchemaTableHarness.requireField(shippingFields, "tracking");
        expect(tracking.type.kind).toBe(OdfTypes.Option);
        if (tracking.type.kind === OdfTypes.Option) {
            expect(tracking.type.inner.kind).toBe(OdfTypes.String);
        }
    });

    it("ORDER_SCHEMA_ODF_JSON round-trips through JSON.parse", () => {
        const parsed = JSON.parse(ORDER_SCHEMA_ODF_JSON) as { fields: DataSchemaField[] };
        expect(parsed.fields).toEqual(ORDER_SCHEMA);
    });

    it("ORDER_SCHEMA_DATASET wraps fields in the { fields } object form", () => {
        expect(Array.isArray(ORDER_SCHEMA_DATASET)).toBeFalse();
        expect(ORDER_SCHEMA_DATASET.fields).toBe(ORDER_SCHEMA);
    });
});
