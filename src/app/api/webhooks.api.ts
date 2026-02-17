/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { first, map, Observable } from "rxjs";

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
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import { onlyCompleteData } from "apollo-angular";

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
            map((result: ObservableQuery.Result<WebhookEventTypesQuery>) => {
                return result.data as WebhookEventTypesQuery;
            }),
        );
    }

    public datasetWebhookSubscriptions(datasetId: string): Observable<DatasetWebhookSubscriptionsQuery> {
        return this.datasetWebhookSubscriptionsGQL
            .watch({ variables: { datasetId }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<DatasetWebhookSubscriptionsQuery>) => {
                    return result.data as DatasetWebhookSubscriptionsQuery;
                }),
            );
    }

    public datasetWebhookCreateSubscription(
        datasetId: string,
        input: WebhookSubscriptionInput,
    ): Observable<DatasetWebhookCreateSubscriptionMutation> {
        return this.datasetWebhookCreateSubscriptionGQL.mutate({ variables: { datasetId, input } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookCreateSubscriptionMutation>) => {
                return result.data as DatasetWebhookCreateSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookRemoveSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookRemoveSubscriptionMutation> {
        return this.datasetWebhookRemoveSubscriptionGQL.mutate({ variables: { datasetId, id } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookRemoveSubscriptionMutation>) => {
                return result.data as DatasetWebhookRemoveSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookRotateSecret(datasetId: string, id: string): Observable<DatasetWebhookRotateSecretMutation> {
        return this.datasetWebhookRotateSecretGQL.mutate({ variables: { datasetId, id } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookRotateSecretMutation>) => {
                return result.data as DatasetWebhookRotateSecretMutation;
            }),
        );
    }

    public datasetWebhookPauseSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookPauseSubscriptionMutation> {
        return this.datasetWebhookPauseSubscriptionGQL.mutate({ variables: { datasetId, id } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookPauseSubscriptionMutation>) => {
                return result.data as DatasetWebhookPauseSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookResumeSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookResumeSubscriptionMutation> {
        return this.datasetWebhookResumeSubscriptionGQL.mutate({ variables: { datasetId, id } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookResumeSubscriptionMutation>) => {
                return result.data as DatasetWebhookResumeSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookReactivateSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookReactivateSubscriptionMutation> {
        return this.datasetWebhookReactivateSubscriptionGQL.mutate({ variables: { datasetId, id } }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookReactivateSubscriptionMutation>) => {
                return result.data as DatasetWebhookReactivateSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookUpdateSubscription(params: {
        datasetId: string;
        id: string;
        input: WebhookSubscriptionInput;
    }): Observable<DatasetWebhookUpdateSubscriptionMutation> {
        return this.datasetWebhookUpdateSubscriptionGQL.mutate({ variables: params }).pipe(
            first(),
            map((result: ApolloLink.Result<DatasetWebhookUpdateSubscriptionMutation>) => {
                return result.data as DatasetWebhookUpdateSubscriptionMutation;
            }),
        );
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
                map((result: ObservableQuery.Result<DatasetWebhookByIdQuery>) => {
                    return result.data as DatasetWebhookByIdQuery;
                }),
            );
    }
}
