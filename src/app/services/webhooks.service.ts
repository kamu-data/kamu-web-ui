/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { WebhooksApi } from "../api/webhooks.api";
import { map, Observable, shareReplay } from "rxjs";
import { WebhookEventTypesQuery } from "../api/kamu.graphql.interface";
import { SubscribedEventType } from "../dataset-view/additional-components/dataset-settings-component/tabs/webhooks/create-edit-subscription-modal/create-edit-subscription-modal.model";

@Injectable({
    providedIn: "root",
})
export class WebhooksService {
    private webhooksApi = inject(WebhooksApi);

    public eventTypes(): Observable<SubscribedEventType[]> {
        return this.webhooksApi.webhookEventTypes().pipe(
            map((result: WebhookEventTypesQuery) => {
                return result.webhooks.eventTypes.map((item) => this.eventTypesMapper(item));
            }),
            shareReplay(),
        );
    }

    private eventTypesMapper(name: string): SubscribedEventType {
        switch (name) {
            case "DATASET.REF.UPDATED":
                return { value: "DATASET.REF.UPDATED", name: "Dataset Updated" };
            /* istanbul ignore next */
            default:
                return { value: "Unknown event type", name: "Unknown label" };
        }
    }
}
