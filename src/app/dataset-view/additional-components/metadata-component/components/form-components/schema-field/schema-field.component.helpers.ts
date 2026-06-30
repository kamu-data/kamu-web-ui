/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors } from "@angular/forms";

import { validateSchemaFields } from "@common/components/edit-schema-table/validation/schema-validation";
import { DataSchemaField } from "@interface/dataset-schema.interface";

export function schemaValidator(control: AbstractControl): ValidationErrors | null {
    const fields = control.value as DataSchemaField[];
    if (!Array.isArray(fields) || fields.length === 0) return null;
    const errors = validateSchemaFields(fields);
    return errors.length > 0 ? { schemaErrors: errors } : null;
}
