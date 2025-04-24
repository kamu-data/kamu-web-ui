/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Data, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { flowDetailsSummaryResolverFn } from "./flow-details-summary.resolver";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import RoutingResolvers from "../../../../../common/resolvers/routing-resolvers";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";

describe("flowDetailsSummaryResolverFn", () => {
    const executeResolver: ResolveFn<DatasetFlowByIdResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsSummaryResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check activeTabResolver", async () => {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            parent: {
                data: {
                    [RoutingResolvers.FLOW_DETAILS_KEY]: mockDatasetFlowByIdResponse,
                } as Data,
            },
        } as ActivatedRouteSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual(mockDatasetFlowByIdResponse);
    });
});
