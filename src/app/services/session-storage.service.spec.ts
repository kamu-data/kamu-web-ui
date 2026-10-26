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
        expect(service.isSidePanelVisible).toBe(false);

        service.setSidePanelVisible(true);
        expect(service.isSidePanelVisible).toBe(true);

        service.setSidePanelVisible(false);
        expect(service.isSidePanelVisible).toBe(false);
    });

    it("should hand out the pending GitHub sign-in only once", () => {
        const pendingLogin = { state: "0123456789abcdef", redirectUrl: "/kamu/dataset?tab=flows" };
        service.setGithubLoginState(pendingLogin);

        expect(service.takeGithubLoginState()).toEqual(pendingLogin);
        expect(service.takeGithubLoginState()).toBeNull();
    });
});
