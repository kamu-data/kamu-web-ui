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
    DatasetWebhookByIdQuery,
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookReactivateSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookRotateSecretMutation,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookSubscription,
    WebhookSubscriptionInput,
} from "src/app/api/kamu.graphql.interface";
import { WebhooksApi } from "src/app/api/webhooks.api";
import { CreateWebhookSubscriptionSuccess } from "../dataset-settings-webhooks-tab.component.types";

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
    ): Observable<CreateWebhookSubscriptionSuccess | null> {
        return this.webhooksApi.datasetWebhookCreateSubscription(datasetId, input).pipe(
            map((data: DatasetWebhookCreateSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.createSubscription.__typename ===
                    "CreateWebhookSubscriptionResultSuccess"
                ) {
                    this.toastrService.success(data.datasets.byId?.webhooks.createSubscription.message);
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
                    this.toastrService.success(data.datasets.byId?.webhooks.subscription?.remove.message);
                    return true;
                } else {
                    this.toastrService.error("Webhook subscription not deleted");
                    return false;
                }
            }),
        );
    }

    public datasetWebhookRotateSecret(datasetId: string, id: string): Observable<string> {
        return this.webhooksApi.datasetWebhookRotateSecret(datasetId, id).pipe(
            map((data: DatasetWebhookRotateSecretMutation) => {
                if (data.datasets.byId?.webhooks.subscription?.rotateSecret) {
                    this.toastrService.success(data.datasets.byId?.webhooks.subscription.rotateSecret.message);
                    return data.datasets.byId.webhooks.subscription.rotateSecret.newSecret;
                } else {
                    return "";
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

    public datasetWebhookReactivateSubscription(datasetId: string, id: string): Observable<boolean> {
        return this.webhooksApi.datasetWebhookReactivateSubscription(datasetId, id).pipe(
            map((data: DatasetWebhookReactivateSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.subscription?.reactivate.__typename ===
                    "ReactivateWebhookSubscriptionResultSuccess"
                ) {
                    this.toastrService.success(data.datasets.byId.webhooks.subscription.reactivate.message);
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.webhooks.subscription?.reactivate.message);
                    return false;
                }
            }),
        );
    }

    public datasetWebhookUpdateSubscription(params: {
        datasetId: string;
        id: string;
        input: WebhookSubscriptionInput;
    }): Observable<boolean> {
        return this.webhooksApi.datasetWebhookUpdateSubscription(params).pipe(
            map((data: DatasetWebhookUpdateSubscriptionMutation) => {
                if (
                    data.datasets.byId?.webhooks.subscription?.update.__typename ===
                    "UpdateWebhookSubscriptionResultSuccess"
                ) {
                    this.toastrService.success(data.datasets.byId?.webhooks.subscription?.update.message);
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.webhooks.subscription?.update.message);
                    return false;
                }
            }),
        );
    }

    public datasetWebhookSubscriptionById(params: { datasetId: string; id: string }): Observable<WebhookSubscription> {
        return this.webhooksApi.datasetWebhookSubscriptionById(params).pipe(
            map((data: DatasetWebhookByIdQuery) => {
                return data.datasets.byId?.webhooks.subscription as WebhookSubscription;
            }),
        );
    }
}
