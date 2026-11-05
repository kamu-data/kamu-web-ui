/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "@common/values/app.values";
import { GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";

import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransformYamlType,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    datasetInfoFromSchemaQuery,
    transformInputsFormArray,
    unavailableDatasetInfo,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";

describe("datasetInfoFromSchemaQuery", () => {
    it("should take the owner, name and schema from the dataset", () => {
        const info = datasetInfoFromSchemaQuery(mockGetDatasetSchemaQuery);

        expect(info.owner).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.owner.accountName ?? "");
        expect(info.name).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.name ?? "");
        expect(info.schema?.length).toBeGreaterThan(0);
    });

    it("should keep a dataset without a schema available", () => {
        const data = structuredClone(mockGetDatasetSchemaQuery);
        if (data.datasets.byId) {
            data.datasets.byId.metadata.currentSchema = null;
        }

        const info = datasetInfoFromSchemaQuery(data);

        expect(info.name).toEqual(mockGetDatasetSchemaQuery.datasets.byId?.name ?? "");
        expect(info.schema).toBeUndefined();
    });

    it("should mark a missing dataset as unavailable", () => {
        const data: GetDatasetSchemaQuery = { datasets: { __typename: "Datasets", byId: null } };

        expect(datasetInfoFromSchemaQuery(data)).toEqual(unavailableDatasetInfo());
    });
});

describe("unavailableDatasetInfo", () => {
    it("should label the input as unavailable, without owner or schema", () => {
        expect(unavailableDatasetInfo()).toEqual({ name: AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL, owner: "" });
    });
});

describe("transformInputsFormArray", () => {
    const [first, second] = mockParseSetTransformYamlType.inputs;

    it("should hold the inputs in their order", () => {
        const form = transformInputsFormArray([second, first]);

        expect(form.getRawValue()).toEqual([second, first]);
        expect(form.valid).toBe(true);
    });

    it("should require each alias and reject a blank one", () => {
        const form = transformInputsFormArray([first]);
        const alias = form.controls[0].controls.alias;

        alias.setValue("");
        expect(alias.errors).toEqual({ required: true });

        alias.setValue("   ");
        expect(alias.errors).toEqual({ blank: true });
    });

    it("should reject two inputs with the same alias, ignoring surrounding spaces", () => {
        const form = transformInputsFormArray([first, second]);

        form.controls[1].controls.alias.setValue(` ${first.alias} `);

        expect(form.errors).toEqual({ duplicateItems: { value: first.alias } });
    });

    it("should accept the aliases once they differ again", () => {
        const form = transformInputsFormArray([first, { ...second, alias: first.alias }]);
        expect(form.valid).toBe(false);

        form.controls[1].controls.alias.setValue("transactions");

        expect(form.valid).toBe(true);
    });
});
