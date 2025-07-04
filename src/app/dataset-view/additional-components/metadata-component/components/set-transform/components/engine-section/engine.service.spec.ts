/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { EngineService } from "./engine.service";
import { Apollo } from "apollo-angular";

describe("EngineService", () => {
    let service: EngineService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EngineService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
