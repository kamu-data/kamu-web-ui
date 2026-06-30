/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "@common/values/app.values";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import {
    SchemaValidationError,
    SchemaValidationErrorCode,
    SchemaWarning,
    SchemaWarningCode,
} from "./schema-validation.types";

export { SchemaValidationError, SchemaValidationErrorCode, SchemaWarning, SchemaWarningCode };

// System/default columns that warrant a warning when used as field names.
const SYSTEM_COLUMN_NAMES = new Set([
    AppValues.DEFAULT_OFFSET_COLUMN_NAME,
    AppValues.DEFAULT_OP_COLUMN_NAME,
    AppValues.DEFAULT_SYSTEM_TIME_COLUMN_NAME,
    AppValues.DEFAULT_EVENT_TIME_COLUMN_NAME,
]);

// Dialect-generic SQL reserved keywords (lowercase-compared).
export const SQL_RESERVED_KEYWORDS = new Set([
    "select",
    "from",
    "where",
    "order",
    "group",
    "by",
    "table",
    "index",
    "join",
    "on",
    "as",
    "and",
    "or",
    "not",
    "null",
    "distinct",
    "having",
    "limit",
    "offset",
    "insert",
    "update",
    "delete",
    "create",
    "drop",
    "alter",
    "into",
    "values",
    "set",
    "case",
    "when",
    "then",
    "else",
    "end",
    "union",
    "all",
    "exists",
    "in",
    "like",
    "between",
    "is",
    "inner",
    "outer",
    "left",
    "right",
    "full",
    "cross",
    "with",
]);

/**
 * Recursively validates a `DataSchemaField[]`, returning hard errors for:
 *  - empty field names,
 *  - names that do not match `AppValues.SCHEMA_NAME_PATTERN`,
 *  - sibling-duplicate names at each scope (including inside every nested struct).
 *
 * Each error carries the path to the offending field (e.g. `["address", "fields", "city"]`)
 * and an error code.
 */
export function validateSchemaFields(fields: DataSchemaField[], basePath: string[] = []): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];
    const seen = new Set<string>();

    for (const field of fields) {
        const fieldPath = [...basePath, field.name];

        if (!field.name) {
            errors.push({ path: fieldPath, code: SchemaValidationErrorCode.EMPTY_NAME });
        } else if (!AppValues.SCHEMA_NAME_PATTERN.test(field.name)) {
            errors.push({ path: fieldPath, code: SchemaValidationErrorCode.INVALID_NAME });
        } else {
            const lower = field.name.toLowerCase();
            if (seen.has(lower)) {
                errors.push({ path: fieldPath, code: SchemaValidationErrorCode.DUPLICATE_NAME });
            } else {
                seen.add(lower);
            }
        }

        if (field.type.kind === OdfTypes.Struct) {
            errors.push(
                ...validateSchemaFields(
                    field.type.fields.map((f) => ({ name: f.name, type: f.type })),
                    [...fieldPath, "fields"],
                ),
            );
        }
    }

    return errors;
}

/**
 * Returns non-blocking warnings for a single field name:
 *  - clash with system/default columns,
 *  - clash with a curated generic SQL-keyword list.
 *
 * Warnings do NOT affect form validity.
 */
export function schemaNameWarnings(name: string): SchemaWarning[] {
    const warnings: SchemaWarning[] = [];
    const lower = name.toLowerCase();

    if (SYSTEM_COLUMN_NAMES.has(lower)) {
        warnings.push({ path: [name], code: SchemaWarningCode.SYSTEM_COLUMN_NAME });
    }
    if (SQL_RESERVED_KEYWORDS.has(lower)) {
        warnings.push({ path: [name], code: SchemaWarningCode.SQL_RESERVED_KEYWORD });
    }

    return warnings;
}
