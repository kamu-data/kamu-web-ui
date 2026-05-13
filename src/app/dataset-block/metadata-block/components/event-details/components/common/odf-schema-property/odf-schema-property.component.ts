/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import { DataSchema } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField, DatasetSchema } from "@interface/dataset-schema.interface";

import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-odf-schema-property",
    imports: [DynamicTableComponent],
    templateUrl: "./odf-schema-property.component.html",
    styleUrl: "./odf-schema-property.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OdfSchemaPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: DataSchema;

    public get datasetSchema(): MaybeNull<DatasetSchema> {
        return parseCurrentSchema(this.data);
    }

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
    }
}
