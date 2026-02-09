/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { extractSchemaFieldsFromData } from "../../../../../../../common/helpers/table.helper";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { EnvVar } from "src/app/api/kamu.graphql.interface";
import { DataRow, DataSchemaField, OperationColumnClassEnum } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DynamicTableComponent } from "../../../../../../../common/components/dynamic-table/dynamic-table.component";
import {
    ColumnDescriptor,
    DynamicTableViewMode,
} from "src/app/common/components/dynamic-table/dynamic-table.interface";

@Component({
    selector: "app-env-variables-property",
    templateUrl: "./env-variables-property.component.html",
    styleUrls: ["./env-variables-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DynamicTableComponent],
})
export class EnvVariablesPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: EnvVar[];

    public readonly DynamicTableViewMode: typeof DynamicTableViewMode = DynamicTableViewMode;

    public get tableSource(): DataRow[] {
        const result: DataRow[] = [];
        this.data.forEach(({ name, value }: EnvVar) =>
            result.push({
                name: {
                    value: name,
                    cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
                },
                value: {
                    value: value ? value : "null",
                    cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
                },
            }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }

    public inferTableSchema(schema: DataSchemaField[]): ColumnDescriptor[] {
        return schema.map((f: DataSchemaField) => ({ columnName: f.name }));
    }
}
