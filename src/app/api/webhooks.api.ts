/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { first, map, Observable } from "rxjs";

import { ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";

import { mutationData } from "@common/helpers/apollo-error.helpers";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import {
    DatasetWebhookByIdGQL,
    DatasetWebhookByIdQuery,
    DatasetWebhookCreateSubscriptionGQL,
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionGQL,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookReactivateSubscriptionGQL,
    DatasetWebhookReactivateSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionGQL,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionGQL,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookRotateSecretGQL,
    DatasetWebhookRotateSecretMutation,
    DatasetWebhookSubscriptionsGQL,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionGQL,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookEventTypesGQL,
    WebhookEventTypesQuery,
    WebhookSubscriptionInput,
} from "@api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class WebhooksApi {
    private webhookEventTypesGQL = inject(WebhookEventTypesGQL);
    private datasetWebhookSubscriptionsGQL = inject(DatasetWebhookSubscriptionsGQL);
    private datasetWebhookCreateSubscriptionGQL = inject(DatasetWebhookCreateSubscriptionGQL);
    private datasetWebhookRemoveSubscriptionGQL = inject(DatasetWebhookRemoveSubscriptionGQL);
    private datasetWebhookPauseSubscriptionGQL = inject(DatasetWebhookPauseSubscriptionGQL);
    private datasetWebhookResumeSubscriptionGQL = inject(DatasetWebhookResumeSubscriptionGQL);
    private datasetWebhookReactivateSubscriptionGQL = inject(DatasetWebhookReactivateSubscriptionGQL);
    private datasetWebhookUpdateSubscriptionGQL = inject(DatasetWebhookUpdateSubscriptionGQL);
    private datasetWebhookSubscriptionByIdGQL = inject(DatasetWebhookByIdGQL);
    private datasetWebhookRotateSecretGQL = inject(DatasetWebhookRotateSecretGQL);

    public webhookEventTypes(): Observable<WebhookEventTypesQuery> {
        return this.webhookEventTypesGQL.watch().valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<WebhookEventTypesQuery, "complete">) => {
                return result.data;
            }),
        );
    }

    public datasetWebhookSubscriptions(datasetId: string): Observable<DatasetWebhookSubscriptionsQuery> {
        return this.datasetWebhookSubscriptionsGQL
            .watch({ variables: { datasetId }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetWebhookSubscriptionsQuery, "complete">) => {
                    return result.data;
                }),
            );
    }

    public datasetWebhookCreateSubscription(
        datasetId: string,
        input: WebhookSubscriptionInput,
    ): Observable<DatasetWebhookCreateSubscriptionMutation> {
        return this.datasetWebhookCreateSubscriptionGQL
            .mutate({ variables: { datasetId, input } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookRemoveSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookRemoveSubscriptionMutation> {
        return this.datasetWebhookRemoveSubscriptionGQL
            .mutate({ variables: { datasetId, id } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookRotateSecret(datasetId: string, id: string): Observable<DatasetWebhookRotateSecretMutation> {
        return this.datasetWebhookRotateSecretGQL
            .mutate({ variables: { datasetId, id } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookPauseSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookPauseSubscriptionMutation> {
        return this.datasetWebhookPauseSubscriptionGQL
            .mutate({ variables: { datasetId, id } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookResumeSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookResumeSubscriptionMutation> {
        return this.datasetWebhookResumeSubscriptionGQL
            .mutate({ variables: { datasetId, id } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookReactivateSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookReactivateSubscriptionMutation> {
        return this.datasetWebhookReactivateSubscriptionGQL
            .mutate({ variables: { datasetId, id } })
            .pipe(first(), mutationData());
    }

    public datasetWebhookUpdateSubscription(params: {
        datasetId: string;
        id: string;
        input: WebhookSubscriptionInput;
    }): Observable<DatasetWebhookUpdateSubscriptionMutation> {
        return this.datasetWebhookUpdateSubscriptionGQL.mutate({ variables: params }).pipe(first(), mutationData());
    }

    public datasetWebhookSubscriptionById(params: {
        datasetId: string;
        id: string;
    }): Observable<DatasetWebhookByIdQuery> {
        return this.datasetWebhookSubscriptionByIdGQL
            .watch({ variables: { ...params }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetWebhookByIdQuery, "complete">) => {
                    return result.data;
                }),
            );
    }
}
