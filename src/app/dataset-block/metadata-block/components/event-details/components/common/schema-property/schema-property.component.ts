/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { extractSchemaFieldsFromData } from "src/app/common/helpers/data-schema.helpers";
import { DataSchemaField } from "src/app/interface/dataset-schema.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { NgIf } from "@angular/common";
import {
    DynamicTableColumnClassEnum,
    DynamicTableDataRow,
} from "src/app/common/components/dynamic-table/dynamic-table.interface";

@Component({
    selector: "app-schema-property",
    templateUrl: "./schema-property.component.html",
    styleUrls: ["./schema-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        DynamicTableComponent,
    ],
})
export class SchemaPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string[];

    public get tableSource(): DynamicTableDataRow[] {
        return this.data.map((item: string) => ({
            name: {
                value: item.split(" ")[0],
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            type: {
                value: item.split(" ")[1],
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
        }));
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
