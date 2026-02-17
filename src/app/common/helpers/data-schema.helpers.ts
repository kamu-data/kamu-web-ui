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
} from "src/app/interface/dataset-schema.interface";

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
    switch (type.kind) {
        case OdfTypes.Option:
            return `${odfType2String(type.inner)}?`;
        case OdfTypes.Null:
            return `${type.kind}<${type.inner ? odfType2String(type.inner) : ""}>`;
        case OdfTypes.List: {
            const innerContent =
                "inner" in type.itemType && type.itemType.inner ? odfType2String(type.itemType) : type.itemType.kind;
            return `${type.kind}<${innerContent}>`;
        }
        case OdfTypes.Timestamp:
            return `${type.kind}<${type.unit}, ${type.timezone}>`;
        case OdfTypes.Duration:
        case OdfTypes.Time:
            return `${type.kind}<${type.unit}>`;
        case OdfTypes.Map:
            return `${type.kind}<${type.keyType.kind}, ${type.valueType.kind}>`;
        case OdfTypes.Struct:
            return type.fields.length
                ? `${type.kind}<${type.fields.map((x) => `${x.name}:${odfType2String(x.type)}`).join(", ")}>`
                : "";

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
