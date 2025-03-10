/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { accountResolver } from "./account.resolver";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";

describe("accountResolver", () => {
    const executeResolver: ResolveFn<DatasetsAccountResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
