/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

export const accountActiveTabResolver: ResolveFn<string> = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const pathWithoutQuery = state.url.split("?")[0];
    const routeSegments = pathWithoutQuery.split("/").filter(Boolean);
    return routeSegments[routeSegments.length - 1];
};
