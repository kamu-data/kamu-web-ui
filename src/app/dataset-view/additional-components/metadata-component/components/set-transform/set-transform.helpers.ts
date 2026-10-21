/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { parseCurrentSchema } from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import {
    DatasetNode,
    TransformSelectedInput,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";

export function datasetNodeFromSchemaQuery(alias: string, data: GetDatasetSchemaQuery): DatasetNode {
    const dataset = data.datasets.byId;
    if (!dataset) {
        return { name: AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL, owner: "", alias };
    }

    const schema = parseCurrentSchema(dataset.metadata.currentSchema);
    return {
        name: dataset.name,
        owner: dataset.owner.accountName,
        alias,
        schema: schema?.fields.length ? schema.fields : undefined,
    };
}

/**
 * Key of a transform input in the set of selected inputs. It holds only `datasetRef` and `alias`,
 * always in that order, so the same input gives the same key wherever it was built.
 */
export function inputDatasetKey(input: Pick<TransformSelectedInput, "datasetRef" | "alias">): string {
    return JSON.stringify({ datasetRef: input.datasetRef, alias: input.alias });
}

export function parseInputDatasetKey(key: string): TransformSelectedInput {
    return JSON.parse(key) as TransformSelectedInput;
}
