/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { parseCurrentSchema } from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import { DatasetNode } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";

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
