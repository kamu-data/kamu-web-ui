/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { SqlQueryStep, TransformInput } from "@api/kamu.graphql.interface";
import { DataSchemaField } from "@interface/dataset-schema.interface";

/** A transformation input as the editor keeps it and as a `SetTransform` event holds it */
export type TransformSelectedInput = Pick<TransformInput, "datasetRef" | "alias">;

/** A SQL query step as a `SetTransform` event holds it */
export type TransformQueryStep = Omit<SqlQueryStep, "__typename">;

/**
 * A `SetTransform` event in the shape its YAML holds, which the editor reads from a block and
 * writes back. Unlike the GraphQL `SetTransform`, its inputs carry no resolved dataset.
 */
export interface SetTransformEvent {
    inputs: TransformSelectedInput[];
    transform: {
        kind: string;
        engine: string;
        queries?: TransformQueryStep[];
        // A single-step transform may carry one `query` instead of `queries`
        query?: string;
    };
}

export interface EditSetTransformParseType {
    content: {
        event: SetTransformYamlType;
    };
}

export type SetTransformYamlType = SetTransformEvent & {
    kind: string;
};

/** An input in the editor: the dataset it reads and the query alias the user may change */
export interface TransformInputFormType {
    datasetRef: FormControl<string>;
    alias: FormControl<string>;
}

export type TransformInputForm = FormGroup<TransformInputFormType>;

/** The editor's inputs in the order the event stores them */
export type TransformInputsFormArray = FormArray<TransformInputForm>;

/** What the editor shows about an input's dataset */
export interface TransformInputDatasetInfo {
    name: string;
    owner: string;
    schema?: DataSchemaField[];
}
