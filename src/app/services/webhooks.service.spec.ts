/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { WebhooksService } from "./webhooks.service";

describe("WebhooksService", () => {
    let service: WebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WebhooksService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
