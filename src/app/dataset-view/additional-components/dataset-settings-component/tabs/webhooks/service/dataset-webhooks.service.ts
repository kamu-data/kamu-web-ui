/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { DatasetWebhookSubscriptionsQuery, WebhookSubscription } from "src/app/api/kamu.graphql.interface";
import { WebhooksApi } from "src/app/api/webhooks.api";

@Injectable({
    providedIn: "root",
})
export class DatasetWebhooksService {
    private webhooksApi = inject(WebhooksApi);

    public datasetWebhookSubscriptions(datasetId: string): Observable<WebhookSubscription[]> {
        return this.webhooksApi.datasetWebhookSubscriptions(datasetId).pipe(
            map((data: DatasetWebhookSubscriptionsQuery) => {
                return data.datasets.byId?.webhooks.subscriptions as WebhookSubscription[];
            }),
        );
    }
}
