/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { WebhooksApi } from "./webhooks.api";
import { TestBed } from "@angular/core/testing";

describe("WebhooksApi", () => {
    let service: WebhooksApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebhooksApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(WebhooksApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
