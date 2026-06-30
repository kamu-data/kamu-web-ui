/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSchemaField, DataSchemaTypeField, OdfTypes } from "@interface/dataset-schema.interface";

export enum EditSchemaView {
    SCHEMA = "schema",
    STRUCT = "struct",
}

export interface SchemaField {
    name: string;
    type: DataSchemaTypeField;
}

export interface DataSchemaTypeOption {
    label: OdfTypes;
    value: OdfTypes;
}

export type TimestampPrecision = "Second" | "Millisecond" | "Microsecond" | "Nanosecond";
export type TimestampTimezone = "UTC";

export interface UnitTimestampOption {
    label: TimestampPrecision;
    value: TimestampPrecision;
}

export interface TimezoneTimestampOption {
    label: TimestampTimezone;
    value: TimestampTimezone;
}

export const TIMEZONE_OPTIONS_LIST: TimezoneTimestampOption[] = [
    {
        label: "UTC",
        value: "UTC",
    },
];

export const UNIT_OPTIONS_LIST: UnitTimestampOption[] = [
    {
        label: "Second",
        value: "Second",
    },
    {
        label: "Millisecond",
        value: "Millisecond",
    },
    {
        label: "Microsecond",
        value: "Microsecond",
    },
    {
        label: "Nanosecond",
        value: "Nanosecond",
    },
];

export const TYPES_OPTIONS_LIST: DataSchemaTypeOption[] = [
    {
        label: OdfTypes.String,
        value: OdfTypes.String,
    },
    {
        label: OdfTypes.Binary,
        value: OdfTypes.Binary,
    },
    {
        label: OdfTypes.Bool,
        value: OdfTypes.Bool,
    },
    {
        label: OdfTypes.Date,
        value: OdfTypes.Date,
    },
    {
        label: OdfTypes.Decimal,
        value: OdfTypes.Decimal,
    },
    {
        label: OdfTypes.Duration,
        value: OdfTypes.Duration,
    },
    {
        label: OdfTypes.Float16,
        value: OdfTypes.Float16,
    },
    {
        label: OdfTypes.Float32,
        value: OdfTypes.Float32,
    },
    {
        label: OdfTypes.Float64,
        value: OdfTypes.Float64,
    },
    {
        label: OdfTypes.Int8,
        value: OdfTypes.Int8,
    },
    {
        label: OdfTypes.Int16,
        value: OdfTypes.Int16,
    },
    {
        label: OdfTypes.Int32,
        value: OdfTypes.Int32,
    },
    {
        label: OdfTypes.Int64,
        value: OdfTypes.Int64,
    },
    {
        label: OdfTypes.UInt8,
        value: OdfTypes.UInt8,
    },
    {
        label: OdfTypes.UInt16,
        value: OdfTypes.UInt16,
    },
    {
        label: OdfTypes.UInt32,
        value: OdfTypes.UInt32,
    },
    {
        label: OdfTypes.UInt64,
        value: OdfTypes.UInt64,
    },
    {
        label: OdfTypes.List,
        value: OdfTypes.List,
    },
    {
        label: OdfTypes.Map,
        value: OdfTypes.Map,
    },
    {
        label: OdfTypes.Null,
        value: OdfTypes.Null,
    },
    {
        label: OdfTypes.Option,
        value: OdfTypes.Option,
    },
    {
        label: OdfTypes.Struct,
        value: OdfTypes.Struct,
    },
    {
        label: OdfTypes.Time,
        value: OdfTypes.Time,
    },
    {
        label: OdfTypes.Timestamp,
        value: OdfTypes.Timestamp,
    },
];
export interface ChangeStructType {
    data: DataSchemaField;
    index: number;
}
