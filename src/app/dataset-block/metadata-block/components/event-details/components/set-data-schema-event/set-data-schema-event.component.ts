/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetDataSchema } from "src/app/api/kamu.graphql.interface";
import { parseCurrentSchema } from "src/app/common/helpers/app.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { DynamicTableComponent } from "../../../../../../common/components/dynamic-table/dynamic-table.component";
import { NgIf } from "@angular/common";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";

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
    ]
})
export class SetDataSchemaEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetDataSchema;

    public get datasetSchema(): MaybeNull<DatasetSchema> {
        return parseCurrentSchema(this.event.schema);
    }
}
