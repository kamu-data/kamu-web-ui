/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { AccountTabs } from "src/app/account/account.constants";

export const accountActiveTabResolver: ResolveFn<AccountTabs> = (
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const routeSegments = state.url.split(/[/?]+/);
    const setSegments = new Set(routeSegments);
    return Object.values(AccountTabs).filter((item) => setSegments.has(item))[0];
};
