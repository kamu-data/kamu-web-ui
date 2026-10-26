/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";

import { flowDetailsSummaryResolverFn } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/resolver/flow-details-summary.resolver";

describe("flowDetailsSummaryResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
    });

    it("should return flow details data from parent route", async () => {
        const route = routeSnapshot({
            parent: routeSnapshot({
                data: {
                    [RoutingResolvers.FLOW_DETAILS_KEY]: mockDatasetFlowByIdResponse,
                },
            }),
        });

        const result = await runResolver(flowDetailsSummaryResolverFn, route);

        expect(result).toBe(mockDatasetFlowByIdResponse);
    });
});
