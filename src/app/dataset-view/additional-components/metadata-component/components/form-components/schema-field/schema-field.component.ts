/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { EditSchemaTableComponent } from "@common/components/edit-schema-table/edit-schema-table.component";
import {
    SchemaValidationError,
    validateSchemaFields,
} from "@common/components/edit-schema-table/validation/schema-validation";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";

@Component({
    selector: "app-schema-field",
    templateUrl: "./schema-field.component.html",
    styleUrls: ["./schema-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        EditSchemaTableComponent,
    ],
})
export class SchemaFieldComponent extends BaseField<FormControl<DataSchemaField[]>> implements OnInit {
    public schemaErrors: SchemaValidationError[] = [];

    public override ngOnInit(): void {
        super.ngOnInit();
        this.schemaErrors = validateSchemaFields(this.control.value);
        this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fields) => {
            this.schemaErrors = validateSchemaFields(fields);
            this.cdr.markForCheck();
        });
    }

    public onFieldsChange(fields: DataSchemaField[]): void {
        this.control.setValue(fields);
        this.control.markAsTouched();
    }
}
