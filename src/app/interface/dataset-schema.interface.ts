/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum OdfTypes {
    Binary = "Binary",
    Bool = "Bool",
    Date = "Date",
    Decimal = "Decimal",
    Duration = "Duration",
    Float16 = "Float16",
    Float32 = "Float32",
    Float64 = "Float64",
    Int8 = "Int8",
    Int16 = "Int16",
    Int32 = "Int32",
    Int64 = "Int64",
    UInt8 = "UInt8",
    UInt16 = "UInt16",
    UInt32 = "UInt32",
    UInt64 = "UInt64",
    List = "List",
    Map = "Map",
    Null = "Null",
    Option = "Option",
    Struct = "Struct",
    Time = "Time",
    Timestamp = "Timestamp",
    String = "String",
}

export enum OdfExtraAttributes {
    EXTRA_ATTRIBUTE_DESCRIPTION = "opendatafabric.org/description",
    EXTRA_ATTRIBUTE_TYPE = "opendatafabric.org/type",
}

export interface DatasetSchema {
    fields: DataSchemaField[];
}

export interface DataSchemaField {
    name: string;
    type: DataSchemaTypeField;
    extra?: {
        [OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION]: string;
        [OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE]: {
            kind: string;
        };
        [key: string]: string | Record<string, unknown>;
    };
}

interface DataSchemaBaseField {
    kind: OdfTypes;
}

interface DataSchemaOptionField extends DataSchemaBaseField {
    kind: OdfTypes.Option;
    inner: DataSchemaTypeField;
}
interface DataSchemaNullField extends DataSchemaBaseField {
    kind: OdfTypes.Null;
    inner?: DataSchemaTypeField;
}
interface DataSchemaListField extends DataSchemaBaseField {
    kind: OdfTypes.List;
    itemType: DataSchemaTypeField;
}
interface DataSchemaTimeField extends DataSchemaBaseField {
    kind: OdfTypes.Timestamp | OdfTypes.Duration | OdfTypes.Time;
    unit: string;
    timezone?: string;
}
interface DataSchemaMapField extends DataSchemaBaseField {
    kind: OdfTypes.Map;
    keyType: { kind: string };
    valueType: { kind: string };
}
interface DataSchemaStructField extends DataSchemaBaseField {
    kind: OdfTypes.Struct;
    fields: { name: string; type: DataSchemaTypeField }[];
}
interface DataSchemaDefaultField extends DataSchemaBaseField {
    kind: Exclude<
        OdfTypes,
        | OdfTypes.Option
        | OdfTypes.Null
        | OdfTypes.List
        | OdfTypes.Timestamp
        | OdfTypes.Duration
        | OdfTypes.Time
        | OdfTypes.Map
        | OdfTypes.Struct
    >;
}

export type DataSchemaTypeField =
    | DataSchemaOptionField
    | DataSchemaNullField
    | DataSchemaListField
    | DataSchemaTimeField
    | DataSchemaMapField
    | DataSchemaStructField
    | DataSchemaDefaultField;
