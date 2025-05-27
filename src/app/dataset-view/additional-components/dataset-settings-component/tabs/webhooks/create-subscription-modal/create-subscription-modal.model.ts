/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { WebhookSubscriptionInput } from "src/app/api/kamu.graphql.interface";
export interface SubscribedEventType {
    name: string;
    value: string;
}

export interface CreateWebhookSubscriptionSucces {
    datasetId: string;
    input: WebhookSubscriptionInput;
    subscriptionId: string;
    secret?: string;
}
