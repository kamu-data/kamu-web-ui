/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum SchemaValidationErrorCode {
    EMPTY_NAME = "Name is required",
    INVALID_NAME = "Invalid characters used",
    DUPLICATE_NAME = "This name is already taken",
}

export enum SchemaWarningCode {
    SYSTEM_COLUMN_NAME = "Matches a system column name",
    SQL_RESERVED_KEYWORD = "SQL reserved keyword",
}

export interface SchemaValidationError {
    path: string[];
    code: SchemaValidationErrorCode;
}

export interface SchemaWarning {
    path: string[];
    code: SchemaWarningCode;
}
