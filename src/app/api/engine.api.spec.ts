/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { EngineApi } from "./engine.api";
import { Apollo, ApolloModule } from "apollo-angular";

describe("EngineApi", () => {
    let service: EngineApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EngineApi, Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EngineApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
