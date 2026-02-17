/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { SetDataSchema } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { DataSchemaField, DatasetSchema } from "src/app/interface/dataset-schema.interface";

import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { DynamicTableComponent } from "../../../../../../common/components/dynamic-table/dynamic-table.component";

@Component({
    selector: "app-set-data-schema-event",
    templateUrl: "./set-data-schema-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        BlockRowDataComponent,
        DynamicTableComponent,
    ],
})
export class SetDataSchemaEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetDataSchema;

    public get datasetSchema(): MaybeNull<DatasetSchema> {
        return parseCurrentSchema(this.event.schema);
    }

    public inferTableSchema(schema: DataSchemaField[]): string[] {
        return schema.map((f: DataSchemaField) => f.name);
    }

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
    }
}
