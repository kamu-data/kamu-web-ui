/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { AccountWithEmailFragment } from "@api/kamu.graphql.interface";

import { accountSettingsAccountResolverFn } from "./account-settings-account.resolver";

describe("accountSettingsAccountResolver", () => {
    const executeResolver: ResolveFn<AccountWithEmailFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsAccountResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
