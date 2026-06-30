/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { EditSchemaTableComponent } from "@common/components/edit-schema-table/edit-schema-table.component";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";

export interface SchemaType {
    name: string;
    type: string;
}

export function replaceFieldByIndex(
    fields: DataSchemaField[],
    indexToReplace: number,
    newFieldData: DataSchemaField,
): DataSchemaField[] {
    return fields.map((field, index) => (index === indexToReplace ? { ...newFieldData } : field));
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
export class SchemaFieldComponent extends BaseField implements OnInit {
    public schemaFields: DataSchemaField[] = [];

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.schemaFields = (this.form.controls.schema.value as DataSchemaField[]) ?? [];
    }

    public onFieldsChange(fields: DataSchemaField[]): void {
        this.schemaFields = fields;
        this.form.controls.schema.setValue(fields);
        this.cdr.detectChanges();
    }
}
