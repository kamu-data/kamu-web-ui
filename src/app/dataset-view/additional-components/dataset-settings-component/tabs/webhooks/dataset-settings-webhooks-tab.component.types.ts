/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import {
    WebhookSubscription,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface DatasetSettingsWebhookTabData extends DatasetViewData {
    subscriptions: WebhookSubscription[];
}

export interface SubscribedEventType {
    name: string;
    value: string;
}

export interface CreateWebhookSubscriptionSuccess {
    input: WebhookSubscriptionInput;
    subscriptionId: string;
    status?: WebhookSubscriptionStatus;
    secret: string;
}

export type WebhookSubscriptionFormType = {
    eventTypes: FormControl<string[]>;
    label: FormControl<string>;
    targetUrl: FormControl<string>;
};
