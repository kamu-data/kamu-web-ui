/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "./account-settings-password-and-authentication.resolver";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";

describe("accountSettingsPasswordAndAuthenticationResolver", () => {
    const executeResolver: ResolveFn<AccountWithEmailFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsPasswordAndAuthenticationResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
