/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { EngineService } from "./engine.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("EngineService", () => {
    let service: EngineService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EngineService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
