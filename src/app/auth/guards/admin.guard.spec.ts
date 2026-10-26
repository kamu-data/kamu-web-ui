/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { ApolloTestingModule } from "apollo-angular/testing";

import { expectRedirectTo, runCanActivate } from "@common/helpers/base-test.helpers.spec";

import { adminGuard } from "src/app/auth/guards/admin.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("adminGuard", () => {
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should allow an admin", async () => {
        spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(true);
        expect(await runCanActivate(adminGuard)).toBeTrue();
    });

    it("should redirect a user who is not an admin home", async () => {
        spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(false);
        expectRedirectTo(await runCanActivate(adminGuard), "/");
    });
});
