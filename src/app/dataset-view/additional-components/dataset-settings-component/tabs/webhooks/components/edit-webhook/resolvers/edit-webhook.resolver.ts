/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { DatasetBasicsFragment, WebhookSubscription } from "src/app/api/kamu.graphql.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { DatasetWebhooksService } from "../../../service/dataset-webhooks.service";

export const editWebhookResolverFn: ResolveFn<WebhookSubscription> = (route: ActivatedRouteSnapshot) => {
    console.log("route=", route.paramMap.get(ProjectLinks.URL_PARAM_WEBHOOK_ID));
    const webhookId=route.paramMap.get(ProjectLinks.URL_PARAM_WEBHOOK_ID) as string
    const datasetService = inject(DatasetService);
      const datasetWebhooksService = inject(DatasetWebhooksService); 
    return datasetService.datasetChanges.pipe((datasetBasics:DatasetBasicsFragment)=>datasetWebhooksService.);
};
