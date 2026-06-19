/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSchemaTypeField, OdfTypes } from "@interface/dataset-schema.interface";

export interface SchemaField {
    name: string;
    type: DataSchemaTypeField;
}

export interface DataSchemaTypeOption {
    id: number;
    label: OdfTypes;
    value: OdfTypes;
}

export type TimestampPrecision = "Second" | "Millisecond" | "Microsecond" | "Nanosecond";
export type TimestampTimezone = "UTC";

export interface UnitTimestampOption {
    id: number;
    label: TimestampPrecision;
    value: TimestampPrecision;
}

export interface TimezoneTimestampOption {
    id: number;
    label: TimestampTimezone;
    value: TimestampTimezone;
}

export const TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = [
    {
        id: 0,
        label: "UTC",
        value: "UTC",
    },
];

export const UNIT_OPTIONS_LIST: UnitTimestampOption[] = [
    {
        id: 0,
        label: "Second",
        value: "Second",
    },
    {
        id: 1,
        label: "Millisecond",
        value: "Millisecond",
    },
    {
        id: 2,
        label: "Microsecond",
        value: "Microsecond",
    },
    {
        id: 3,
        label: "Nanosecond",
        value: "Nanosecond",
    },
];

export const TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = [
    {
        id: 0,
        label: OdfTypes.String,
        value: OdfTypes.String,
    },
    {
        id: 1,
        label: OdfTypes.Binary,
        value: OdfTypes.Binary,
    },
    {
        id: 2,
        label: OdfTypes.Date,
        value: OdfTypes.Date,
    },
    {
        id: 3,
        label: OdfTypes.Decimal,
        value: OdfTypes.Decimal,
    },
    {
        id: 4,
        label: OdfTypes.Duration,
        value: OdfTypes.Duration,
    },
    {
        id: 5,
        label: OdfTypes.Float16,
        value: OdfTypes.Float16,
    },
    {
        id: 6,
        label: OdfTypes.Float32,
        value: OdfTypes.Float32,
    },
    {
        id: 7,
        label: OdfTypes.Float64,
        value: OdfTypes.Float64,
    },
    {
        id: 8,
        label: OdfTypes.Int8,
        value: OdfTypes.Int8,
    },
    {
        id: 9,
        label: OdfTypes.Int16,
        value: OdfTypes.Int16,
    },
    {
        id: 10,
        label: OdfTypes.Int32,
        value: OdfTypes.Int32,
    },
    {
        id: 11,
        label: OdfTypes.Int64,
        value: OdfTypes.Int64,
    },
    {
        id: 12,
        label: OdfTypes.UInt8,
        value: OdfTypes.UInt8,
    },
    {
        id: 13,
        label: OdfTypes.UInt16,
        value: OdfTypes.UInt16,
    },
    {
        id: 14,
        label: OdfTypes.UInt32,
        value: OdfTypes.UInt32,
    },
    {
        id: 15,
        label: OdfTypes.UInt64,
        value: OdfTypes.UInt64,
    },
    {
        id: 16,
        label: OdfTypes.List,
        value: OdfTypes.List,
    },
    {
        id: 17,
        label: OdfTypes.Map,
        value: OdfTypes.Map,
    },
    {
        id: 18,
        label: OdfTypes.Null,
        value: OdfTypes.Null,
    },
    {
        id: 19,
        label: OdfTypes.Option,
        value: OdfTypes.Option,
    },
    {
        id: 20,
        label: OdfTypes.Struct,
        value: OdfTypes.Struct,
    },
    {
        id: 21,
        label: OdfTypes.Time,
        value: OdfTypes.Time,
    },
    {
        id: 22,
        label: OdfTypes.Timestamp,
        value: OdfTypes.Timestamp,
    },
];
