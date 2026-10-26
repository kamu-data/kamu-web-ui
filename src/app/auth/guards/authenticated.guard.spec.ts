/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { ApolloTestingModule } from "apollo-angular/testing";

import { expectRedirectTo, runCanActivate } from "@common/helpers/base-test.helpers.spec";

import { authenticatedGuard } from "src/app/auth/guards/authenticated.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("authenticatedGuard", () => {
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should allow an authenticated user", async () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        expect(await runCanActivate(authenticatedGuard)).toBe(true);
    });

    it("should redirect an anonymous user home", async () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);
        expectRedirectTo(await runCanActivate(authenticatedGuard), "/");
    });
});
