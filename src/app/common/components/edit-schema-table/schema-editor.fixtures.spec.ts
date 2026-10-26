/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { OdfTypes } from "@interface/dataset-schema.interface";

import { EditSchemaTableHarness } from "./edit-schema-table.harness";
import { ORDER_SCHEMA, ORDER_SCHEMA_DATASET, ORDER_SCHEMA_ODF_JSON } from "./schema-editor.mock";

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
        const parsed: unknown = JSON.parse(ORDER_SCHEMA_ODF_JSON);
        expect(parsed).toEqual({ fields: ORDER_SCHEMA });
    });

    it("ORDER_SCHEMA_DATASET wraps fields in the { fields } object form", () => {
        expect(Array.isArray(ORDER_SCHEMA_DATASET)).toBe(false);
        expect(ORDER_SCHEMA_DATASET.fields).toBe(ORDER_SCHEMA);
    });
});
