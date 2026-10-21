/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { flowDetailsSummaryResolverFn } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/resolver/flow-details-summary.resolver";

describe("flowDetailsSummaryResolverFn", () => {
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetFlowByIdResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsSummaryResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return flow details data from parent route", () => {
        const mockRoute = {
            parent: {
                data: {
                    [RoutingResolvers.FLOW_DETAILS_KEY]: mockDatasetFlowByIdResponse,
                },
            },
        } as unknown as ActivatedRouteSnapshot;

        const result = executeResolver(mockRoute, mockState);

        expect(result).toBe(mockDatasetFlowByIdResponse);
        expect(result).toEqual(mockDatasetFlowByIdResponse);
    });
});
