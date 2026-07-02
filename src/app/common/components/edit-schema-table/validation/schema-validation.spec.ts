/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import {
    schemaNameWarnings,
    SchemaValidationErrorCode,
    SchemaWarningCode,
    validateSchemaFields,
} from "./schema-validation";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function field(name: string, kind: OdfTypes = OdfTypes.String): DataSchemaField {
    return { name, type: { kind } as DataSchemaField["type"] };
}

function structField(name: string, children: DataSchemaField[]): DataSchemaField {
    return { name, type: { kind: OdfTypes.Struct, fields: children } };
}

// ---------------------------------------------------------------------------
// validateSchemaFields
// ---------------------------------------------------------------------------

describe("validateSchemaFields", () => {
    it("should return no errors for a valid flat schema", () => {
        const fields: DataSchemaField[] = [field("id"), field("name"), field("amount")];
        expect(validateSchemaFields(fields)).toEqual([]);
    });

    it("should return no errors for a valid nested schema", () => {
        const fields: DataSchemaField[] = [field("id"), structField("address", [field("city"), field("zip")])];
        expect(validateSchemaFields(fields)).toEqual([]);
    });

    it("should return EMPTY_NAME error for a field with an empty name", () => {
        const fields: DataSchemaField[] = [field("id"), field("")];
        const errors = validateSchemaFields(fields);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.EMPTY_NAME);
    });

    it("should accept a name with spaces (permissive name — valid per SCHEMA_NAME_PATTERN)", () => {
        // SCHEMA_NAME_PATTERN allows spaces after the first character
        const fields: DataSchemaField[] = [field("my field")];
        expect(validateSchemaFields(fields)).toEqual([]);
    });

    it("should return DUPLICATE_NAME error for sibling duplicates at root", () => {
        const fields: DataSchemaField[] = [field("id"), field("name"), field("id")];
        const errors = validateSchemaFields(fields);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        expect(errors[0].path).toEqual(["id"]);
    });

    it("should detect duplicate names case-insensitively at root", () => {
        const fields: DataSchemaField[] = [field("Name"), field("name")];
        const errors = validateSchemaFields(fields);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
    });

    it("should return DUPLICATE_NAME error for duplicates inside a nested struct", () => {
        const fields: DataSchemaField[] = [structField("address", [field("city"), field("zip"), field("city")])];
        const errors = validateSchemaFields(fields);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        // path includes the struct field name + "fields" scope + the duplicated name
        expect(errors[0].path).toEqual(["address", "fields", "city"]);
    });

    it("should not flag same name in different struct scopes as a duplicate", () => {
        const fields: DataSchemaField[] = [
            structField("billing", [field("city")]),
            structField("shipping", [field("city")]),
        ];
        expect(validateSchemaFields(fields)).toEqual([]);
    });

    it("should carry a correct path for a root-level error", () => {
        const fields: DataSchemaField[] = [field("")];
        const errors = validateSchemaFields(fields);
        expect(errors[0].path).toEqual([""]);
    });

    it("should detect errors at multiple levels in the same call", () => {
        const fields: DataSchemaField[] = [field(""), structField("address", [field("city"), field("city")])];
        const errors = validateSchemaFields(fields);
        expect(errors.length).toBe(2);
        const codes = errors.map((e) => e.code);
        expect(codes).toContain(SchemaValidationErrorCode.EMPTY_NAME);
        expect(codes).toContain(SchemaValidationErrorCode.DUPLICATE_NAME);
    });

    it("should validate deeply nested structs recursively", () => {
        const inner = structField("geo", [field("lat"), field("lat")]);
        const outer = structField("address", [inner]);
        const errors = validateSchemaFields([outer]);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        expect(errors[0].path).toEqual(["address", "fields", "geo", "fields", "lat"]);
    });

    it("should return no errors for an empty field array", () => {
        expect(validateSchemaFields([])).toEqual([]);
    });

    it("should detect duplicate names inside a List<Struct> itemType", () => {
        const listField: DataSchemaField = {
            name: "items",
            type: {
                kind: OdfTypes.List,
                itemType: {
                    kind: OdfTypes.Struct,
                    fields: [
                        { name: "sku", type: { kind: OdfTypes.String } },
                        { name: "sku", type: { kind: OdfTypes.String } },
                    ],
                },
            },
        };
        const errors = validateSchemaFields([listField]);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        expect(errors[0].path).toEqual(["items", "itemType", "fields", "sku"]);
    });

    it("should detect duplicate names inside an Option<Struct> inner type", () => {
        const optField: DataSchemaField = {
            name: "payload",
            type: {
                kind: OdfTypes.Option,
                inner: {
                    kind: OdfTypes.Struct,
                    fields: [
                        { name: "x", type: { kind: OdfTypes.Int32 } },
                        { name: "x", type: { kind: OdfTypes.Int32 } },
                    ],
                },
            },
        };
        const errors = validateSchemaFields([optField]);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        expect(errors[0].path).toEqual(["payload", "inner", "fields", "x"]);
    });

    it("should detect duplicate names inside Map value Struct", () => {
        const mapField: DataSchemaField = {
            name: "lookup",
            type: {
                kind: OdfTypes.Map,
                keyType: { kind: OdfTypes.String },
                valueType: {
                    kind: OdfTypes.Struct,
                    fields: [
                        { name: "val", type: { kind: OdfTypes.Int64 } },
                        { name: "val", type: { kind: OdfTypes.Int64 } },
                    ],
                },
            },
        };
        const errors = validateSchemaFields([mapField]);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe(SchemaValidationErrorCode.DUPLICATE_NAME);
        expect(errors[0].path).toEqual(["lookup", "valueType", "fields", "val"]);
    });
});

// ---------------------------------------------------------------------------
// schemaNameWarnings
// ---------------------------------------------------------------------------

describe("schemaNameWarnings", () => {
    it("should return no warnings for a normal field name", () => {
        expect(schemaNameWarnings("amount")).toEqual([]);
    });

    it("should warn for the 'event_time' system column", () => {
        const warnings = schemaNameWarnings("event_time");
        expect(warnings.length).toBe(1);
        expect(warnings[0].code).toBe(SchemaWarningCode.SYSTEM_COLUMN_NAME);
    });

    it("should warn for the 'offset' system column", () => {
        const warnings = schemaNameWarnings("offset");
        // 'offset' is also a SQL keyword — both warnings may be present
        const codes = warnings.map((w) => w.code);
        expect(codes).toContain(SchemaWarningCode.SYSTEM_COLUMN_NAME);
    });

    it("should warn for the 'op' system column", () => {
        const warnings = schemaNameWarnings("op");
        expect(warnings.some((w) => w.code === SchemaWarningCode.SYSTEM_COLUMN_NAME)).toBeTrue();
    });

    it("should warn for the 'system_time' system column", () => {
        const warnings = schemaNameWarnings("system_time");
        expect(warnings.some((w) => w.code === SchemaWarningCode.SYSTEM_COLUMN_NAME)).toBeTrue();
    });

    it("should warn for a SQL reserved keyword", () => {
        const warnings = schemaNameWarnings("select");
        expect(warnings.length).toBe(1);
        expect(warnings[0].code).toBe(SchemaWarningCode.SQL_RESERVED_KEYWORD);
    });

    it("should match SQL keywords case-insensitively", () => {
        const warnings = schemaNameWarnings("SELECT");
        expect(warnings.some((w) => w.code === SchemaWarningCode.SQL_RESERVED_KEYWORD)).toBeTrue();
    });

    it("should produce a warning but NOT an error — validateSchemaFields ignores these names", () => {
        const fields: DataSchemaField[] = [field("event_time"), field("select")];
        const errors = validateSchemaFields(fields);
        expect(errors).toEqual([]);

        const w1 = schemaNameWarnings("event_time");
        const w2 = schemaNameWarnings("select");
        expect(w1.length).toBeGreaterThan(0);
        expect(w2.length).toBeGreaterThan(0);
    });

    it("should carry the name in the warning path", () => {
        const warnings = schemaNameWarnings("from");
        expect(warnings[0].path).toEqual(["from"]);
    });

    it("should return no warnings for an ordinary column name like 'amount'", () => {
        expect(schemaNameWarnings("amount")).toEqual([]);
    });
});
