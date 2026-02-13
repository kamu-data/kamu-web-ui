/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export interface DynamicTableDataRow {
    [key: string]: {
        value: string | number | object;
        cssClass: string;
    };
}

export enum DynamicTableColumnClassEnum {
    SECONDARY_COLOR = "secondary-color",
    ERROR_COLOR = "error-color",
    PRIMARY_COLOR = "primary-color",
}

export interface DynamicTableColumnDescriptor {
    columnName: string;
    showMoreBadge?: {
        extraElementKey: string;
    };
    showInfoBadge?: {
        extraElementKey: string;
    };
}
