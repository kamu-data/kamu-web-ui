/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
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
    DatasetWebhookSubscriptionsGQL,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionGQL,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookEventTypesGQL,
    WebhookEventTypesQuery,
    WebhookSubscriptionInput,
} from "./kamu.graphql.interface";
import { first, map, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { MutationResult } from "apollo-angular";

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
                return result.data as DatasetWebhookCreateSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookRemoveSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookRemoveSubscriptionMutation> {
        return this.datasetWebhookRemoveSubscriptionGQL.mutate({ datasetId, id }).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookRemoveSubscriptionMutation>) => {
                return result.data as DatasetWebhookRemoveSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookPauseSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookPauseSubscriptionMutation> {
        return this.datasetWebhookPauseSubscriptionGQL.mutate({ datasetId, id }).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookPauseSubscriptionMutation>) => {
                return result.data as DatasetWebhookPauseSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookResumeSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookResumeSubscriptionMutation> {
        return this.datasetWebhookResumeSubscriptionGQL.mutate({ datasetId, id }).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookResumeSubscriptionMutation>) => {
                return result.data as DatasetWebhookResumeSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookReactivateSubscription(
        datasetId: string,
        id: string,
    ): Observable<DatasetWebhookReactivateSubscriptionMutation> {
        return this.datasetWebhookReactivateSubscriptionGQL.mutate({ datasetId, id }).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookReactivateSubscriptionMutation>) => {
                return result.data as DatasetWebhookReactivateSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookUpdateSubscription(params: {
        datasetId: string;
        id: string;
        input: WebhookSubscriptionInput;
    }): Observable<DatasetWebhookUpdateSubscriptionMutation> {
        return this.datasetWebhookUpdateSubscriptionGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<DatasetWebhookUpdateSubscriptionMutation>) => {
                return result.data as DatasetWebhookUpdateSubscriptionMutation;
            }),
        );
    }

    public datasetWebhookSubscriptionById(params: {
        datasetId: string;
        id: string;
    }): Observable<DatasetWebhookByIdQuery> {
        return this.datasetWebhookSubscriptionByIdGQL.watch({ ...params }, noCacheFetchPolicy).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetWebhookByIdQuery>) => {
                return result.data;
            }),
        );
    }
}
