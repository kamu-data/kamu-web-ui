/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ProcessDatasetCardInteractionService } from "./process-dataset-card-interaction.service";

describe("ProcessDatasetCardInteractionService", () => {
    let service: ProcessDatasetCardInteractionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(ProcessDatasetCardInteractionService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
