/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import ProjectLinks from "src/app/project-links";

import { overviewTabQueryParamsResolverFn } from "./overview-tab-query-params.resolver";

describe("overviewTabQueryParamsResolver", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check resolver", async () => {
        const route = routeSnapshot({
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: undefined,
                [ProjectLinks.URL_QUERY_PARAM_VERSION]: 2,
            },
        });

        const result = await runResolver(overviewTabQueryParamsResolverFn, route);
        expect(result).toEqual({
            pathPrefix: "/",
            version: 2,
        });
    });

    ["abc", "-1", "1.5"].forEach((invalidVersion: string) => {
        it(`should read the version "${invalidVersion}" as the latest`, async () => {
            const route = routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_VERSION]: invalidVersion } });

            const result = await runResolver(overviewTabQueryParamsResolverFn, route);
            expect(result).toEqual({ pathPrefix: "/", version: 0 });
        });
    });
});
