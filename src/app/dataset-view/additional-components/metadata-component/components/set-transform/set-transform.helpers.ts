/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { uniqueItemsValidator } from "@common/validation/collection.validators";
import { notBlankValidator } from "@common/validation/text.validators";
import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import {
    TransformInputDatasetInfo,
    TransformInputForm,
    TransformInputsFormArray,
    TransformSelectedInput,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";

export function datasetInfoFromSchemaQuery(data: GetDatasetSchemaQuery): TransformInputDatasetInfo {
    const dataset = data.datasets.byId;
    if (!dataset) {
        return unavailableDatasetInfo();
    }

    const schema = parseCurrentSchema(dataset.metadata.currentSchema);
    return {
        name: dataset.name,
        owner: dataset.owner.accountName,
        schema: schema?.fields.length ? schema.fields : undefined,
    };
}

/** Info of an input whose dataset is missing or could not be loaded */
export function unavailableDatasetInfo(): TransformInputDatasetInfo {
    return { name: AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL, owner: "" };
}

export function transformInputForm(input: TransformSelectedInput): TransformInputForm {
    return new FormGroup({
        datasetRef: new FormControl(input.datasetRef, { nonNullable: true }),
        alias: new FormControl(input.alias, {
            nonNullable: true,
            validators: [Validators.required, notBlankValidator()],
        }),
    });
}

function aliasOf(inputForm: AbstractControl): unknown {
    const alias: unknown = inputForm.get("alias")?.value;
    return typeof alias === "string" ? alias.trim() : alias;
}

/** Each input's query alias names one table in the queries, so no two inputs may share it */
export function transformInputsFormArray(inputs: TransformSelectedInput[]): TransformInputsFormArray {
    return new FormArray(inputs.map(transformInputForm), { validators: [uniqueItemsValidator(aliasOf)] });
}
