/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { accountFlowsResolverFn, AccountFlowsType } from "./account-flows.resolver";
import ProjectLinks from "src/app/project-links";
import { AccountFlowsNav } from "../account-flows-tab.types";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";

describe("accountFlowsResolverFn", () => {
    const executeResolver: ResolveFn<AccountFlowsType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountFlowsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check accountFlowsResolverFn without status", async () => {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            queryParamMap: convertToParamMap({
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: AccountFlowsNav.ACTIVITY,
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: undefined,
            }),
        } as ActivatedRouteSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Finished],
        });
    });

    it("should check accountFlowsResolverFn with statuses", async () => {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            queryParamMap: convertToParamMap({
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: AccountFlowsNav.ACTIVITY,
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: "RUNNING,RETRYING",
            }),
        } as ActivatedRouteSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Running, FlowStatus.Retrying],
        });
    });
});
