/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import RoutingResolvers from "./routing-resolvers";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

export const flowDetailsSummaryResolver: ResolveFn<DatasetFlowByIdResponse> = (route: ActivatedRouteSnapshot) => {
    const flowByIdResponse = route.parent?.data[RoutingResolvers.FLOW_DETAILS_KEY] as DatasetFlowByIdResponse;
    return flowByIdResponse;
};
