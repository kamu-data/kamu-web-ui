/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { OdfTypes } from "src/app/interface/dataset-schema.interface";

import { DynamicTableDataRow } from "./dynamic-table.interface";

export const MOCK_DATA_ROWS: DynamicTableDataRow[] = [
    {
        offset: {
            value: 285,
            cssClass: "primary-color",
        },
        op: {
            value: "+A",
            cssClass: "primary-color",
        },
        system_time: {
            value: "2025-01-15T10:13:18.328Z",
            cssClass: "primary-color",
        },
        block_time: {
            value: "2025-01-09T20:55:59Z",
            cssClass: "primary-color",
        },
    },
    {
        offset: {
            value: 286,
            cssClass: "primary-color",
        },
        op: {
            value: "-R",
            cssClass: "error-color",
        },
        system_time: {
            value: "2025-01-15T10:13:18.328Z",
            cssClass: "primary-color",
        },
        block_time: {
            value: "2025-01-09T20:55:59Z",
            cssClass: "primary-color",
        },
    },
    {
        offset: {
            value: 287,
            cssClass: "primary-color",
        },
        op: {
            value: "-C",
            cssClass: "secondary-color",
        },
        system_time: {
            value: "2025-01-15T10:13:18.328Z",
            cssClass: "primary-color",
        },
        block_time: {
            value: "2025-01-09T20:57:47Z",
            cssClass: "primary-color",
        },
    },
    {
        offset: {
            value: 288,
            cssClass: "primary-color",
        },
        op: {
            value: "+C",
            cssClass: "secondary-color",
        },
        system_time: {
            value: "2025-01-15T10:13:18.328Z",
            cssClass: "primary-color",
        },
        block_time: {
            value: "2025-01-09T20:57:47Z",
            cssClass: "primary-color",
        },
    },
];

export const MOCK_DATA_ROWS_SHOW_MORE_BADGE: DynamicTableDataRow[] = [
    {
        name: {
            value: "mri_content_hash",
            cssClass: "primary-color",
        },
        type: {
            value: "Multihash",
            cssClass: "primary-color",
        },
        description: {
            value: "This dataset contains daily weather measurements including temperature, precipitation, wind speed, and humidity.\nIt is intended for climate analysis and historical weather trend studies.\n",
            cssClass: "primary-color",
        },
        extraKeys: {
            value: {
                name: "mri_content_hash",
                type: {
                    kind: OdfTypes.String,
                },
                extra: {
                    "opendatafabric.org/description":
                        "This dataset contains daily weather measurements including temperature, precipitation, wind speed, and humidity.\nIt is intended for climate analysis and historical weather trend studies.\n",
                    "opendatafabric.org/type": {
                        kind: "Multihash",
                    },
                },
            },
            cssClass: "primary-color",
        },
    },
];
