/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { requireValue } from "@common/helpers/app.helpers";
import { routeDataAs } from "@common/helpers/untyped-boundary.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

export const flowDetailsSummaryResolverFn: ResolveFn<DatasetFlowByIdResponse> = (route: ActivatedRouteSnapshot) => {
    // The parent resolver either provides the flow or redirects, so the parent data always holds it
    return routeDataAs<DatasetFlowByIdResponse>(requireValue(route.parent).data, RoutingResolvers.FLOW_DETAILS_KEY);
};
