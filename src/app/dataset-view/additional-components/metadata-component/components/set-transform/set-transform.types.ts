/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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

export interface DatasetNode {
    name: string;
    schema?: DataSchemaField[];
    owner: string;
    // Alias as stored in the event's inputs, with or without an account prefix
    alias: string;
}
