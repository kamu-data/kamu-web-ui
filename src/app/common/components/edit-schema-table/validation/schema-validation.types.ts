/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum SchemaValidationErrorCode {
    EMPTY_NAME = "EMPTY_NAME",
    INVALID_NAME = "INVALID_NAME",
    DUPLICATE_NAME = "DUPLICATE_NAME",
}

export enum SchemaWarningCode {
    SYSTEM_COLUMN_NAME = "SYSTEM_COLUMN_NAME",
    SQL_RESERVED_KEYWORD = "SQL_RESERVED_KEYWORD",
}

export interface SchemaValidationError {
    path: string[];
    code: SchemaValidationErrorCode;
}

export interface SchemaWarning {
    path: string[];
    code: SchemaWarningCode;
}
