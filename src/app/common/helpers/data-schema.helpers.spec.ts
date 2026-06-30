/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    normalizeSchemaFields,
    odfType2String,
    schemaFieldsToObjectForm,
} from "@common/helpers/data-schema.helpers";
import { DataSchemaField, DataSchemaTypeField, OdfTypes } from "@interface/dataset-schema.interface";

describe("odfType2String", () => {
    it("should map simple types correctly", () => {
        const field: DataSchemaTypeField = { kind: OdfTypes.Int32 };
        expect(odfType2String(field)).toBe("Int32");
    });

    it("should map Option type with recursion", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Option,
            inner: { kind: OdfTypes.String },
        };
        expect(odfType2String(field)).toBe("String?");
    });

    it("should map Null type", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Null,
            inner: { kind: OdfTypes.String },
        };
        expect(odfType2String(field)).toBe("Null<String>");
    });

    it("should map Duration type", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Duration,
            unit: "Millisecond",
        };
        expect(odfType2String(field)).toBe("Duration<Millisecond>");
    });

    it("should map Time type", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Time,
            unit: "Millisecond",
        };
        expect(odfType2String(field)).toBe("Time<Millisecond>");
    });

    it("should map List type", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.List,
            itemType: { kind: OdfTypes.Float64 },
        };
        expect(odfType2String(field)).toBe("List<Float64>");
    });

    it("should map Timestamp with unit and timezone", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Timestamp,
            unit: "ms",
            timezone: "UTC",
        };
        expect(odfType2String(field)).toBe("Timestamp<ms, UTC>");
    });

    it("should map Map type with key and value types", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Map,
            keyType: { kind: OdfTypes.String },
            valueType: { kind: OdfTypes.Int64 },
        };
        expect(odfType2String(field)).toBe("Map<String, Int64>");
    });

    it("should map Struct with fields", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Struct,
            fields: [
                { name: "id", type: { kind: OdfTypes.Int32 } },
                { name: "name", type: { kind: OdfTypes.String } },
            ],
        };
        expect(odfType2String(field)).toBe("Struct<id:Int32, name:String>");
    });

    it("should handle nested complex types (List of Options)", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.List,
            itemType: {
                kind: OdfTypes.Option,
                inner: { kind: OdfTypes.Int32 },
            },
        };
        expect(odfType2String(field)).toBe("List<Int32?>");
    });

    it("should return the kind label for an empty Struct", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Struct,
            fields: [],
        };
        expect(odfType2String(field)).toBe("Struct");
    });
});

describe("normalizeSchemaFields", () => {
    const nestedFields: DataSchemaField[] = [
        { name: "id", type: { kind: OdfTypes.Int32 } },
        {
            name: "address",
            type: {
                kind: OdfTypes.Struct,
                fields: [{ name: "city", type: { kind: OdfTypes.String } }],
            },
        },
    ];

    it("should normalize the ODF object form", () => {
        expect(normalizeSchemaFields({ fields: nestedFields })).toEqual(nestedFields);
    });

    it("should normalize a bare DataSchemaField array", () => {
        expect(normalizeSchemaFields(nestedFields)).toEqual(nestedFields);
    });

    it("should be idempotent on already-normalized input", () => {
        const once = normalizeSchemaFields(nestedFields);
        expect(normalizeSchemaFields(once)).toEqual(nestedFields);
    });

    it("should map a legacy flat row with a known type to its OdfTypes kind", () => {
        const legacy = [{ name: "amount", type: "Int64" }];
        expect(normalizeSchemaFields(legacy)).toEqual([{ name: "amount", type: { kind: OdfTypes.Int64 } }]);
    });

    it("should fall back to String for an unknown legacy type string", () => {
        const legacy = [{ name: "weird", type: "DECIMAL(10,2)" }];
        expect(normalizeSchemaFields(legacy)).toEqual([{ name: "weird", type: { kind: OdfTypes.String } }]);
    });

    it("should return an empty array for null/undefined input", () => {
        expect(normalizeSchemaFields(null)).toEqual([]);
        expect(normalizeSchemaFields(undefined)).toEqual([]);
    });
});

describe("schemaFieldsToObjectForm", () => {
    it("should wrap fields in the canonical { fields } object form", () => {
        const fields: DataSchemaField[] = [{ name: "id", type: { kind: OdfTypes.Int32 } }];
        expect(schemaFieldsToObjectForm(fields)).toEqual({ fields });
    });

    it("should produce an object form that round-trips through normalizeSchemaFields", () => {
        const fields: DataSchemaField[] = [{ name: "id", type: { kind: OdfTypes.Int32 } }];
        expect(normalizeSchemaFields(schemaFieldsToObjectForm(fields))).toEqual(fields);
    });
});
