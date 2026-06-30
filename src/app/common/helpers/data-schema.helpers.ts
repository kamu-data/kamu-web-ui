/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DynamicTableColumnClassEnum,
    DynamicTableDataRow,
} from "@common/components/dynamic-table/dynamic-table.interface";
import { removeAllLineBreaks } from "@common/helpers/app.helpers";
import {
    DataSchemaField,
    DataSchemaTypeField,
    DatasetSchema,
    OdfExtraAttributes,
    OdfTypes,
} from "@interface/dataset-schema.interface";

export function parseSchemaFromJson(schemaContent: string): DatasetSchema {
    return JSON.parse(removeAllLineBreaks(schemaContent)) as DatasetSchema;
}

export const extractSchemaFieldsFromData = (data: DynamicTableDataRow): DataSchemaField[] => {
    return Object.keys(data).map((item: string) => ({
        name: item,
        type: {
            kind: OdfTypes.String,
        },
    }));
};

export function odfType2String(type: DataSchemaTypeField): string {
    const defaultUnit = "Millisecond";
    const defaultTimezone = "UTC";
    switch (type.kind) {
        case OdfTypes.Option:
            return `${odfType2String(type.inner)}?`;
        case OdfTypes.Null:
            return `${type.kind}<${type.inner ? odfType2String(type.inner) : ""}>`;
        case OdfTypes.List: {
            return `${type.kind}<${odfType2String(type.itemType)}>`;
        }
        case OdfTypes.Timestamp: {
            return `${type.kind}<${type.unit ?? defaultUnit}, ${type.timezone ?? defaultTimezone}>`;
        }
        case OdfTypes.Duration:
        case OdfTypes.Time:
            return `${type.kind}<${type.unit ?? defaultUnit}>`;
        case OdfTypes.Map:
            return `${type.kind}<${odfType2String(type.keyType)}, ${odfType2String(type.valueType)}>`;
        case OdfTypes.Struct:
            return type.fields.length
                ? `${type.kind}<${type.fields.map((x) => `${x.name}:${odfType2String(x.type)}`).join(", ")}>`
                : `Struct`;

        default:
            return type.kind;
    }
}

export function schemaAsDataRows(schema: DataSchemaField[]): DynamicTableDataRow[] {
    return schema.map((x) => {
        return {
            name: { value: x.name, cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR },
            type: {
                value:
                    x.extra && OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE in x.extra
                        ? x.extra[OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE].kind
                        : odfType2String(x.type),
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            description: {
                value:
                    x.extra && OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION in x.extra
                        ? x.extra[OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION]
                        : "",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            extraKeys: {
                value: x.extra && Object.keys(x.extra).length ? x : "",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
        };
    });
}

/**
 * Normalizes any accepted schema input into the canonical rich `DataSchemaField[]` model.
 *
 * Accepts:
 *  - the ODF object form `{ fields: DataSchemaField[] }`, or
 *  - a bare `DataSchemaField[]` (already normalized — idempotent).
 */
export function normalizeSchemaFields(input: DatasetSchema | DataSchemaField[] | null | undefined): DataSchemaField[] {
    if (!input) {
        return [];
    }
    return Array.isArray(input) ? input : input.fields;
}

/**
 * Wraps a `DataSchemaField[]` in the canonical ODF object wire shape `{ fields }` used by the YAML
 * builders.
 */
export function schemaFieldsToObjectForm(fields: DataSchemaField[]): DatasetSchema {
    return { fields };
}

/**
 * Extracts and normalizes `DataSchemaField[]` from a GQL read-step's
 * `schema(format: ODF_JSON)` field.  Returns `[]` when the field is absent
 * or empty so callers never receive `null`/`undefined`.
 */
export function extractSchemaFromReadStep(
    readStep: { schema?: { content: string } | null } | null | undefined,
): DataSchemaField[] {
    const content = readStep?.schema?.content;
    if (!content) return [];
    return normalizeSchemaFields(parseSchemaFromJson(content));
}

export function schemaEditAsDataRows(schema: DataSchemaField[]): DataSchemaField[] {
    return schema.map((x) => {
        return {
            name: x.name,
            type: x.type,
        };
    });
}
