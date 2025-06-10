/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { WebhookSubscriptionInput, WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
export interface SubscribedEventType {
    name: string;
    value: string;
}

export interface CreateWebhookSubscriptionSuccess {
    input: WebhookSubscriptionInput;
    subscriptionId: string;
    status?: WebhookSubscriptionStatus;
    secret?: string;
}

export enum WebhookSubscriptionModalAction {
    CREATE = "create",
    UPDATE = "update",
    VERIFY = "werify",
    CLOSE = "close",
}

export interface WebhookSubscriptionModalActionResult {
    action: WebhookSubscriptionModalAction;
    payload?: WebhookSubscriptionInput;
}

export type WebhookSubscriptionFormType = {
    eventTypes: FormControl<string[]>;
    label: FormControl<string>;
    targetUrl: FormControl<string>;
};

export interface UpdateWebhookSubscriptionType {
    result: boolean;
    payload: WebhookSubscriptionInput | undefined;
}
