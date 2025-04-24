/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { accountActiveTabResolverFn } from "./account-active-tab.resolver";
import { AccountTabs } from "src/app/account/account.constants";

describe("accountActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<AccountTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
