/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { DatasetAsCollectionService } from "./dataset-as-collection.service";

describe("DatasetAsCollectionService", () => {
    let service: DatasetAsCollectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DatasetAsCollectionService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
