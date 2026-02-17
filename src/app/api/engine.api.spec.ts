/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { importProvidersFrom } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { EngineApi } from "./engine.api";

describe("EngineApi", () => {
    let service: EngineApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EngineApi, Apollo, importProvidersFrom(ApolloTestingModule)],
        });
        service = TestBed.inject(EngineApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
