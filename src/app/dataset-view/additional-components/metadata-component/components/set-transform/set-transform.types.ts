/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetTransform, TransformInput } from "src/app/api/kamu.graphql.interface";

export type TransformSelectedInput = Omit<TransformInput, "__typename" | "dataset">;

export interface EditSetTransformParseType {
    content: {
        event: SetTransformYamlType;
    };
}

export type SetTransformYamlType = Omit<SetTransform, "__typename"> & {
    kind: string;
    transform: {
        kind: string;
        query?: string;
    };
};

export interface DatasetNode {
    name: string;
    type?: {
        kind: string;
    };
    owner?: string;
    children?: DatasetNode[];
}
