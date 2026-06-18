/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { EditSchemaTableComponent } from "@common/components/edit-schema-table/edit-schema-table.component";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { schemaEditAsDataRows } from "@common/helpers/data-schema.helpers";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";

export interface SchemaType {
    name: string;
    type: string;
}

@Component({
    selector: "app-schema-field",
    templateUrl: "./schema-field.component.html",
    styleUrls: ["./schema-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//

        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatTableModule,
        MatIconModule,
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        EditSchemaTableComponent,
    ],
})
export class SchemaFieldComponent extends BaseField {
    public schemaData(schema: DataSchemaField[]): DataSchemaField[] {
        return schemaEditAsDataRows(schema);
    }
}
