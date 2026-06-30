/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { EditSchemaTableComponent } from "@common/components/edit-schema-table/edit-schema-table.component";
import {
    schemaNameWarnings,
    SchemaValidationError,
    SchemaWarning,
} from "@common/components/edit-schema-table/validation/schema-validation";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";

import { schemaValidator } from "./schema-field.component.helpers";

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
    public get schemaControl(): FormControl<DataSchemaField[]> {
        return this.form.get(this.controlName) as FormControl<DataSchemaField[]>;
    }

    public get schemaErrors(): SchemaValidationError[] {
        const err = this.schemaControl.errors;
        return (err?.["schemaErrors"] as SchemaValidationError[]) ?? [];
    }

    public get schemaWarnings(): SchemaWarning[] {
        const fields = this.schemaControl.value ?? [];
        return fields.flatMap((f) => schemaNameWarnings(f.name));
    }

    public ngOnInit(): void {
        this.schemaControl.addValidators(schemaValidator);
        this.schemaControl.updateValueAndValidity();
    }

    public onFieldsChange(fields: DataSchemaField[]): void {
        this.schemaControl.setValue(fields);
        this.schemaControl.markAsTouched();
    }
}
