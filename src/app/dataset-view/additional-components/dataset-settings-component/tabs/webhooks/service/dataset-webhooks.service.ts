/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { ErrorTexts } from "@common/values/errors.text";
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
    UpdateWebhookSubscriptionResultUnexpected,
    WebhookSubscriptionDataFragment,
    WebhookSubscriptionDuplicateLabel,
    WebhookSubscriptionInput,
    WebhookSubscriptionInvalidTargetUrl,
    WebhookSubscriptionNoEventTypesProvided,
} from "@api/kamu.graphql.interface";
import { WebhooksApi } from "@api/webhooks.api";
import { MaybeNull } from "@interface/app.types";

import { CreateWebhookSubscriptionSuccess } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

/** A rejection kamu-cli ties to one field of the webhook form. */
export interface WebhookFieldError {
    field: "targetUrl" | "label";
    message: string;
}

export type WebhookMutationResult<T> = { ok: true; value: T } | { ok: false; fieldError: MaybeNull<WebhookFieldError> };

/** Every result of a create or update that kamu-cli returns instead of the subscription. */
type WebhookRejection = Pick<
    | WebhookSubscriptionDuplicateLabel
    | WebhookSubscriptionInvalidTargetUrl
    | WebhookSubscriptionNoEventTypesProvided
    | UpdateWebhookSubscriptionResultUnexpected,
    "__typename" | "message"
>;

function webhookFieldError(result: WebhookRejection): MaybeNull<WebhookFieldError> {
    switch (result.__typename) {
        case "WebhookSubscriptionDuplicateLabel":
            return { field: "label", message: ErrorTexts.ERROR_WEBHOOK_DUPLICATE_LABEL };
        case "WebhookSubscriptionInvalidTargetUrl":
            return { field: "targetUrl", message: result.message };
        case "WebhookSubscriptionNoEventTypesProvided":
        case "UpdateWebhookSubscriptionResultUnexpected":
            return null;
    }
}

@Injectable({
    providedIn: "root",
})
export class DatasetWebhooksService {
    private webhooksApi = inject(WebhooksApi);
    private toastrService = inject(ToastrService);

    public datasetWebhookSubscriptions(datasetId: string): Observable<WebhookSubscriptionDataFragment[]> {
        return this.webhooksApi.datasetWebhookSubscriptions(datasetId).pipe(
            map((data: DatasetWebhookSubscriptionsQuery) => {
                return requireValue(data.datasets.byId, "Dataset not found").webhooks.subscriptions;
            }),
        );
    }

    public datasetWebhookCreateSubscription(
        datasetId: string,
        input: WebhookSubscriptionInput,
    ): Observable<WebhookMutationResult<CreateWebhookSubscriptionSuccess>> {
        return this.webhooksApi.datasetWebhookCreateSubscription(datasetId, input).pipe(
            map(
                (
                    data: DatasetWebhookCreateSubscriptionMutation,
                ): WebhookMutationResult<CreateWebhookSubscriptionSuccess> => {
                    const result = requireValue(data.datasets.byId, "Dataset not found").webhooks.createSubscription;
                    if (result.__typename === "CreateWebhookSubscriptionResultSuccess") {
                        this.toastrService.success(result.message);
                        return {
                            ok: true,
                            value: { secret: result.secret, input, subscriptionId: result.subscriptionId },
                        };
                    }
                    return this.rejected(result);
                },
            ),
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
    }): Observable<WebhookMutationResult<true>> {
        return this.webhooksApi.datasetWebhookUpdateSubscription(params).pipe(
            map((data: DatasetWebhookUpdateSubscriptionMutation): WebhookMutationResult<true> => {
                const result = requireValue(
                    data.datasets.byId?.webhooks.subscription,
                    "Webhook subscription not found",
                ).update;
                if (result.__typename === "UpdateWebhookSubscriptionResultSuccess") {
                    this.toastrService.success(result.message);
                    return { ok: true, value: true };
                }
                return this.rejected(result);
            }),
        );
    }

    /** A rejection the form shows on a field, or a toast for one that belongs to no field. */
    private rejected(result: WebhookRejection): WebhookMutationResult<never> {
        const fieldError = webhookFieldError(result);
        if (!fieldError) {
            this.toastrService.error(result.message);
        }
        return { ok: false, fieldError };
    }

    /** Emits `null` when the dataset has no subscription with this ID. */
    public datasetWebhookSubscriptionById(params: {
        datasetId: string;
        id: string;
    }): Observable<MaybeNull<WebhookSubscriptionDataFragment>> {
        return this.webhooksApi.datasetWebhookSubscriptionById(params).pipe(
            map((data: DatasetWebhookByIdQuery) => {
                return data.datasets.byId?.webhooks.subscription ?? null;
            }),
        );
    }
}
