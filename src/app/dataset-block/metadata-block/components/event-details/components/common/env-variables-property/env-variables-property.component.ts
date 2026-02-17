/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { EnvVar } from "src/app/api/kamu.graphql.interface";
import {
    DynamicTableColumnClassEnum,
    DynamicTableColumnDescriptor,
    DynamicTableDataRow,
} from "@common/components/dynamic-table/dynamic-table.interface";
import { DataSchemaField } from "src/app/interface/dataset-schema.interface";

import { DynamicTableComponent } from "../../../../../../../common/components/dynamic-table/dynamic-table.component";
import { extractSchemaFieldsFromData } from "../../../../../../../common/helpers/data-schema.helpers";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-env-variables-property",
    templateUrl: "./env-variables-property.component.html",
    styleUrls: ["./env-variables-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DynamicTableComponent],
})
export class EnvVariablesPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: EnvVar[];

    public get tableSource(): DynamicTableDataRow[] {
        const result: DynamicTableDataRow[] = [];
        this.data.forEach(({ name, value }: EnvVar) =>
            result.push({
                name: {
                    value: name,
                    cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
                },
                value: {
                    value: value ? value : "null",
                    cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
                },
            }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }

    public inferTableSchema(schema: DataSchemaField[]): DynamicTableColumnDescriptor[] {
        return schema.map((f: DataSchemaField) => ({ columnName: f.name }));
    }
}
