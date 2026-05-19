/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { OverviewTabQueryParamsType } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

import { overviewTabQueryParamsResolverFn } from "./overview-tab-query-params.resolver";

describe("overviewTabQueryParamsResolver", () => {
    const executeResolver: ResolveFn<OverviewTabQueryParamsType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => overviewTabQueryParamsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", () => {
        const routeSnapshot = {
            queryParamMap: convertToParamMap({ [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: undefined }),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as OverviewTabQueryParamsType;
        expect(result).toEqual({
            pathPrefix: "/",
        });
    });
});
