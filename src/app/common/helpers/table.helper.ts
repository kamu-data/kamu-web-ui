/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSchemaField, OdfTypes } from "src/app/interface/dataset-schema.interface";
import { DynamicTableDataRow } from "../components/dynamic-table/dynamic-table.interface";

export const extractSchemaFieldsFromData = (data: DynamicTableDataRow): DataSchemaField[] => {
    return Object.keys(data).map((item: string) => ({
        name: item,
        type: {
            kind: OdfTypes.String,
        },
    }));
};
