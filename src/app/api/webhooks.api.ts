/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import {
    DatasetWebhookCreateSubscriptionGQL,
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookSubscriptionsGQL,
    DatasetWebhookSubscriptionsQuery,
    WebhookEventTypesGQL,
    WebhookEventTypesQuery,
    WebhookSubscriptionInput,
} from "./kamu.graphql.interface";
import { first, map, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { DatasetOperationError } from "../common/values/errors";
import { MutationResult } from "apollo-angular";

@Injectable({ providedIn: "root" })
export class WebhooksApi {
    private webhookEventTypesGQL = inject(WebhookEventTypesGQL);
    private datasetWebhookSubscriptionsGQL = inject(DatasetWebhookSubscriptionsGQL);
    private datasetWebhookCreateSubscriptionGQL = inject(DatasetWebhookCreateSubscriptionGQL);

    public webhookEventTypes(): Observable<WebhookEventTypesQuery> {
        return this.webhookEventTypesGQL.watch().valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<WebhookEventTypesQuery>) => {
                return result.data;
            }),
        );
    }

    public datasetWebhookSubscriptions(datasetId: string): Observable<DatasetWebhookSubscriptionsQuery> {
        return this.datasetWebhookSubscriptionsGQL.watch({ datasetId }, noCacheFetchPolicy).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetWebhookSubscriptionsQuery>) => {
                return result.data;
            }),
        );
    }

    public datasetWebhookCreateSubscription(
        datasetId: string,
        input: WebhookSubscriptionInput,
    ): Observable<DatasetWebhookCreateSubscriptionMutation> {
        return this.datasetWebhookCreateSubscriptionGQL.mutate({ datasetId, input }).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookCreateSubscriptionMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }
}
