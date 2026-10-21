/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, convertToParamMap } from "@angular/router";

import { datasetInfoFromRoute } from "@common/resolvers/resolver.helpers";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import ProjectLinks from "src/app/project-links";

describe("datasetInfoFromRoute", () => {
    function routeWith(params: Record<string, string>): ActivatedRouteSnapshot {
        return { paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;
    }

    it("should read the account and dataset names from the route", () => {
        const route = routeWith({
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
        });

        expect(datasetInfoFromRoute(route)).toEqual({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
    });

    it("should throw when the route has no dataset name", () => {
        const route = routeWith({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME });

        expect(() => datasetInfoFromRoute(route)).toThrowError();
    });
});
