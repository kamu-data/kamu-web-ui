/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { EditSchemaTableComponent } from "@common/components/edit-schema-table/edit-schema-table.component";
import {
    SchemaValidationError,
    validateSchemaFields,
} from "@common/components/edit-schema-table/validation/schema-validation";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { requireFormControl } from "@common/helpers/form.helpers";
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
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        EditSchemaTableComponent,
    ],
})
export class SchemaFieldComponent extends BaseField implements OnInit {
    private readonly cdr = inject(ChangeDetectorRef);

    public get schemaControl(): FormControl<DataSchemaField[]> {
        return requireFormControl(this.form, this.controlName);
    }

    public schemaErrors: SchemaValidationError[] = [];

    public ngOnInit(): void {
        this.schemaControl.addValidators(schemaValidator);
        this.schemaControl.updateValueAndValidity();
        this.schemaErrors = validateSchemaFields(this.schemaControl.value);
        this.schemaControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fields) => {
            this.schemaErrors = validateSchemaFields(fields);
            this.cdr.markForCheck();
        });
    }

    public onFieldsChange(fields: DataSchemaField[]): void {
        this.schemaControl.setValue(fields);
        this.schemaControl.markAsTouched();
    }
}
