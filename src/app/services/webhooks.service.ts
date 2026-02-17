/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, shareReplay } from "rxjs";

import { WebhookEventTypesQuery } from "@api/kamu.graphql.interface";
import { WebhooksApi } from "@api/webhooks.api";
import { eventTypesMapper } from "@common/helpers/data.helpers";
import { SubscribedEventType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

@Injectable({
    providedIn: "root",
})
export class WebhooksService {
    private webhooksApi = inject(WebhooksApi);

    public eventTypes(): Observable<SubscribedEventType[]> {
        return this.webhooksApi.webhookEventTypes().pipe(
            map((result: WebhookEventTypesQuery) => {
                return result.webhooks.eventTypes.map((item) => eventTypesMapper(item));
            }),
            shareReplay(),
        );
    }
}
