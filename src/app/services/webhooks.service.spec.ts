/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { WebhooksService } from "./webhooks.service";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";
import { mockWebhookEventTypesQuery } from "../api/mock/webhooks.mock";
import { WebhooksApi } from "./../api/webhooks.api";
import { SubscribedEventType } from "../dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

describe("WebhooksService", () => {
    let service: WebhooksService;
    let webhooksApi: WebhooksApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(WebhooksService);
        webhooksApi = TestBed.inject(WebhooksApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check return event types", () => {
        spyOn(webhooksApi, "webhookEventTypes").and.returnValue(of(mockWebhookEventTypesQuery));

        service.eventTypes().subscribe((result: SubscribedEventType[]) => {
            expect(result).toEqual([{ value: "DATASET.REF.UPDATED", name: "Dataset Updated" }]);
        });
    });
});
