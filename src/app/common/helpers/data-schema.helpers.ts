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
 * A legacy flat schema row: a field name paired with a plain string type (the pre-ODF-object
 * representation). Retained only for backward compatibility while loading already-stored schemas.
 */
interface LegacyFlatSchemaField {
    name: string;
    type: string;
}

function isLegacyFlatSchemaField(field: unknown): field is LegacyFlatSchemaField {
    return (
        typeof field === "object" &&
        field !== null &&
        "type" in field &&
        typeof (field as { type: unknown }).type === "string"
    );
}

function isKnownOdfType(value: string): value is OdfTypes {
    return (Object.values(OdfTypes) as string[]).includes(value);
}

/**
 * Normalizes any accepted schema input into the canonical rich `DataSchemaField[]` model.
 *
 * Accepts:
 *  - the ODF object form `{ fields: DataSchemaField[] }`,
 *  - a bare `DataSchemaField[]` (already normalized — idempotent), or
 *  - the legacy flat form `{ name: string; type: string }[]`.
 *
 * For a legacy flat row the string `type` is wrapped as `{ kind }`, best-effort: if the string is a
 * known `OdfTypes` it is used directly, otherwise we keep `String`. Full DDL-type parsing (e.g.
 * compound/nested types encoded as strings) is intentionally out of scope here — see TODO below.
 */
export function normalizeSchemaFields(
    input: DatasetSchema | DataSchemaField[] | LegacyFlatSchemaField[] | null | undefined,
): DataSchemaField[] {
    if (!input) {
        return [];
    }

    const fields: (DataSchemaField | LegacyFlatSchemaField)[] = Array.isArray(input) ? input : input.fields;

    return fields.map((field) => {
        if (isLegacyFlatSchemaField(field)) {
            // TODO: shallow best-effort mapping only — complex DDL type strings are not parsed here.
            const kind = isKnownOdfType(field.type) ? field.type : OdfTypes.String;
            return {
                name: field.name,
                type: { kind } as DataSchemaTypeField,
            };
        }
        return field;
    });
}

/**
 * Wraps a `DataSchemaField[]` in the canonical ODF object wire shape `{ fields }` used by the YAML
 * builders.
 */
export function schemaFieldsToObjectForm(fields: DataSchemaField[]): DatasetSchema {
    return { fields };
}

export function schemaEditAsDataRows(schema: DataSchemaField[]): DataSchemaField[] {
    return schema.map((x) => {
        return {
            name: x.name,
            type: x.type,
        };
    });
}
