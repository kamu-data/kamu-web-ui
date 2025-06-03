/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetWebhooksService } from "./dataset-webhooks.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";

describe("DatasetWebhooksService", () => {
    let service: DatasetWebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [HttpClientTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetWebhooksService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
