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

describe("WebhooksService", () => {
    let service: WebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(WebhooksService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
