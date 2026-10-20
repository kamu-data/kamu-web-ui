/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { datasetNodeFromSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";

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
