/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { datasetInfoResolverFn } from "../../../../../common/resolvers/dataset-info.resolver";
import RoutingResolvers from "../../../../../common/resolvers/routing-resolvers";
import { setTransformResolverFn } from "../set-transform/resolver/set-transform.resolver";
import { SetTransformComponent } from "../set-transform/set-transform.component";
import { AddPollingSourceComponent } from "./add-polling-source/add-polling-source.component";
import { addPollingSourceResolverFn } from "./add-polling-source/resolver/add-polling-source.resolver";
import { AddPushSourceComponent } from "./add-push-source/add-push-source.component";
import { addPushSourceResolverFn } from "./add-push-source/resolver/add-push-source.resolver";
import ProjectLinks from "../../../../../project-links";

export const SOURCE_EVENTS_ROUTES: Routes = [
    {
        path: `${ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE}`,
        component: AddPollingSourceComponent,
        resolve: {
            [RoutingResolvers.ADD_POLLING_SOURCE_KEY]: addPollingSourceResolverFn,
            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
        },
    },
    {
        path: `${ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE}`,
        component: AddPushSourceComponent,
        resolve: {
            [RoutingResolvers.ADD_PUSH_SOURCE_KEY]: addPushSourceResolverFn,
            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
        },
    },
    {
        path: `${ProjectLinks.URL_PARAM_SET_TRANSFORM}`,
        component: SetTransformComponent,
        resolve: {
            [RoutingResolvers.SET_TRANSFORM_KEY]: setTransformResolverFn,
            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
        },
    },
];
