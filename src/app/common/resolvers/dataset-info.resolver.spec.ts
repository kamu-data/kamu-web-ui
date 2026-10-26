/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { datasetInfoResolverFn } from "@common/resolvers/dataset-info.resolver";

describe("datasetInfoResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check activeTabResolver", async () => {
        const route = routeSnapshot({
            params: {
                accountName: "mockAccountName",
                datasetName: "mockDatasetName",
            },
        });
        const result = await runResolver(datasetInfoResolverFn, route);

        expect(result).toEqual({
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
        });
    });
});
