/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { map, Observable } from "rxjs";
import {
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookSubscriptionsQuery,
    WebhookSubscription,
    WebhookSubscriptionInput,
} from "src/app/api/kamu.graphql.interface";
import { WebhooksApi } from "src/app/api/webhooks.api";
import { CreateWebhookSubscriptionSucces } from "../create-subscription-modal/create-subscription-modal.model";

@Injectable({
    providedIn: "root",
})
export class DatasetWebhooksService {
    private webhooksApi = inject(WebhooksApi);
    private toastrService = inject(ToastrService);

    public datasetWebhookSubscriptions(datasetId: string): Observable<WebhookSubscription[]> {
        return this.webhooksApi.datasetWebhookSubscriptions(datasetId).pipe(
            map((data: DatasetWebhookSubscriptionsQuery) => {
                return data.datasets.byId?.webhooks.subscriptions as WebhookSubscription[];
            }),
        );
    }

    public datasetWebhookCreateSubscription(
        datasetId: string,
        input: WebhookSubscriptionInput,
    ): Observable<CreateWebhookSubscriptionSucces | null> {
        return this.webhooksApi.datasetWebhookCreateSubscription(datasetId, input).pipe(
            map((data: DatasetWebhookCreateSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.createSubscription.__typename ===
                    "CreateWebhookSubscriptionResultSuccess"
                ) {
                    return {
                        datasetId,
                        secret: data.datasets.byId.webhooks.createSubscription.secret,
                        input,
                        subscriptionId: data.datasets.byId.webhooks.createSubscription.subscriptionId,
                    };
                } else {
                    this.toastrService.error(data.datasets.byId?.webhooks.createSubscription.message);
                    return null;
                }
            }),
        );
    }

    public datasetWebhookRemoveSubscription(datasetId: string, id: string): Observable<boolean> {
        return this.webhooksApi.datasetWebhookRemoveSubscription(datasetId, id).pipe(
            map((data: DatasetWebhookRemoveSubscriptionMutation) => {
                if (data.datasets.byId?.webhooks.subscription?.remove.removed) {
                    return true;
                } else {
                    this.toastrService.error("Webhook not deleted");
                    return false;
                }
            }),
        );
    }

    public datasetWebhookPauseSubscription(datasetId: string, id: string): Observable<boolean> {
        return this.webhooksApi.datasetWebhookPauseSubscription(datasetId, id).pipe(
            map((data: DatasetWebhookPauseSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.subscription?.pause.__typename ===
                    "PauseWebhookSubscriptionResultSuccess"
                ) {
                    this.toastrService.success(data.datasets.byId.webhooks.subscription.pause.message);
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.webhooks.subscription?.pause.message);
                    return false;
                }
            }),
        );
    }

    public datasetWebhookResumeSubscription(datasetId: string, id: string): Observable<boolean> {
        return this.webhooksApi.datasetWebhookResumeSubscription(datasetId, id).pipe(
            map((data: DatasetWebhookResumeSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.subscription?.resume.__typename ===
                    "ResumeWebhookSubscriptionResultSuccess"
                ) {
                    this.toastrService.success(data.datasets.byId.webhooks.subscription.resume.message);
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.webhooks.subscription?.resume.message);
                    return false;
                }
            }),
        );
    }
}
