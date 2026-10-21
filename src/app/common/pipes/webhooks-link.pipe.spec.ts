/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { WebhooksLinkPipe } from "@common/pipes/webhooks-link.pipe";

describe("WebhooksLinkPipe", () => {
    let pipe: WebhooksLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new WebhooksLinkPipe());
    });

    it("should link to the webhooks settings tab", () => {
        expect(router.serializeUrl(pipe.transform({ accountName: "acc", datasetName: "ds" }))).toEqual(
            "/acc/ds/settings/webhooks",
        );
    });

    it("should link to a webhook page", () => {
        expect(
            router.serializeUrl(
                pipe.transform({ accountName: "acc", datasetName: "ds", tab: "edit", webhookId: "w1" }),
            ),
        ).toEqual("/acc/ds/settings/webhooks/edit/w1");
    });
});
