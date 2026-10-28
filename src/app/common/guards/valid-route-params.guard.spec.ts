/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { paramsValidatedBy, validRouteParams } from "@common/guards/valid-route-params.guard";
import { expectPageNotFoundRedirect, routeSnapshot, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { isFlowId, isOdfName } from "@common/helpers/url-params.helpers";

import ProjectLinks from "src/app/project-links";

describe("validRouteParams", () => {
    const guard = validRouteParams({
        [ProjectLinks.URL_PARAM_DATASET_NAME]: isOdfName,
        [ProjectLinks.URL_PARAM_FLOW_ID]: isFlowId,
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should let the route open when every checked parameter is valid", async () => {
        const route = routeSnapshot({
            params: { [ProjectLinks.URL_PARAM_DATASET_NAME]: "my-dataset", [ProjectLinks.URL_PARAM_FLOW_ID]: "42" },
        });

        expect(await runCanActivate(guard, route)).toBe(true);
    });

    [
        {
            description: "one parameter is malformed",
            params: { [ProjectLinks.URL_PARAM_DATASET_NAME]: "my-dataset", [ProjectLinks.URL_PARAM_FLOW_ID]: "abc" },
        },
        {
            description: "a checked parameter is missing",
            params: { [ProjectLinks.URL_PARAM_DATASET_NAME]: "my-dataset" },
        },
    ].forEach(({ description, params }) => {
        it(`should show page-not-found when ${description}`, async () => {
            expectPageNotFoundRedirect(await runCanActivate(guard, routeSnapshot({ params })));
        });
    });

    it("should report the parameters it checks", () => {
        expect(paramsValidatedBy(guard)).toEqual([ProjectLinks.URL_PARAM_DATASET_NAME, ProjectLinks.URL_PARAM_FLOW_ID]);
        expect(paramsValidatedBy(() => true)).toBeUndefined();
    });
});
