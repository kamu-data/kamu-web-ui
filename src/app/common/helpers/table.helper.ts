/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataRow, DataSchemaField } from "../../interface/dataset.interface";

export const extractSchemaFieldsFromData = (data: DataRow): DataSchemaField[] => {
    return Object.keys(data).map((item: string) => ({
        name: item,
        repetition: "",
        type: "",
        logicalType: "",
    }));
};
