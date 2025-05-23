/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetWebhooksService } from "./dataset-webhooks.service";

describe("DatasetWebhooksService", () => {
    let service: DatasetWebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetWebhooksService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
