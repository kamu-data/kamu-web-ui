/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataRow } from "src/app/interface/dataset.interface";

export type TableSourceRowInterface = DataRow;

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

export interface ColumnDescriptor {
    columnName: string;
    showMoreBadge?: boolean;
    showInfoBadge?: boolean;
}
