/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { SessionStorageService } from "src/app/services/session-storage.service";

describe("SessionStorageService", () => {
    let service: SessionStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SessionStorageService);
        service.reset();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be check set state for side panel", () => {
        expect(service.isSidePanelVisible).toBeFalse();

        service.setSidePanelVisible(true);
        expect(service.isSidePanelVisible).toBeTrue();

        service.setSidePanelVisible(false);
        expect(service.isSidePanelVisible).toBeFalse();
    });
});
