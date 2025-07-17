/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";
import { accessTokenExpiredGuardFn } from "./access-token-expired.guard";
import { LocalStorageService } from "src/app/services/local-storage.service";

describe("accessTokenExpiredGuard", () => {
    let localStorageService: LocalStorageService;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accessTokenExpiredGuardFn(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
        localStorageService = TestBed.inject(LocalStorageService);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should check guard return true", () => {
        localStorageService.setAccessToken(null);
    });
});
