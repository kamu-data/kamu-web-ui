/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { odfType2String } from "@common/helpers/data-schema.helpers";
import { DataSchemaTypeField, OdfTypes } from "@interface/dataset-schema.interface";

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
            keyType: { kind: "String" },
            valueType: { kind: "Int64" },
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

    it("should return empty string for empty Struct", () => {
        const field: DataSchemaTypeField = {
            kind: OdfTypes.Struct,
            fields: [],
        };
        expect(odfType2String(field)).toBe("");
    });
});
