/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    datasetNodeFromSchemaQuery,
    inputDatasetKey,
    parseInputDatasetKey,
    unavailableDatasetNode,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";

describe("datasetNodeFromSchemaQuery", () => {
    const ALIAS = "account.tokens.portfolio.usd";

    it("should take the owner and name from the dataset, not from the alias", () => {
        const node = datasetNodeFromSchemaQuery(ALIAS, mockGetDatasetSchemaQuery);

        expect(node.alias).toEqual(ALIAS);
        expect(node.owner).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.owner.accountName ?? "");
        expect(node.name).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.name ?? "");
        expect(node.schema?.length).toBeGreaterThan(0);
    });

    it("should keep a dataset without a schema available", () => {
        const data = structuredClone(mockGetDatasetSchemaQuery);
        if (data.datasets.byId) {
            data.datasets.byId.metadata.currentSchema = null;
        }

        const node = datasetNodeFromSchemaQuery(ALIAS, data);

        expect(node.name).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.name ?? "");
        expect(node.schema).toBeUndefined();
    });

    it("should mark a missing dataset as unavailable and keep its alias", () => {
        const data: GetDatasetSchemaQuery = { datasets: { __typename: "Datasets", byId: null } };

        const node = datasetNodeFromSchemaQuery(ALIAS, data);

        expect(node).toEqual({ name: AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL, owner: "", alias: ALIAS });
    });
});

describe("unavailableDatasetNode", () => {
    it("should label the input as unavailable, without owner or schema, and keep its alias", () => {
        const alias = "kamu/github.stats";

        expect(unavailableDatasetNode(alias)).toEqual({
            name: AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL,
            owner: "",
            alias,
        });
    });
});

describe("inputDatasetKey", () => {
    const DATASET_REF = "did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1";
    const ALIAS = "kamu/github.stats";

    it("should write the dataset reference before the alias", () => {
        expect(inputDatasetKey({ alias: ALIAS, datasetRef: DATASET_REF })).toEqual(
            `{"datasetRef":"${DATASET_REF}","alias":"${ALIAS}"}`,
        );
    });

    it("should give the same key to an input that carries other fields", () => {
        const eventInput = { __typename: "TransformInput", alias: ALIAS, datasetRef: DATASET_REF, extra: 1 };

        expect(inputDatasetKey(eventInput)).toEqual(inputDatasetKey({ datasetRef: DATASET_REF, alias: ALIAS }));
    });

    it("should parse a key back into the input", () => {
        const parsed = parseInputDatasetKey(inputDatasetKey({ datasetRef: DATASET_REF, alias: ALIAS }));

        expect(parsed.datasetRef).toEqual(DATASET_REF);
        expect(parsed.alias).toEqual(ALIAS);
    });
});
