/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, Data, Params, Route } from "@angular/router";

const IDENTITY_QUERY_PARAMS_KEY = "identityQueryParams";

/**
 * Route settings, spread into a route, naming the query parameters that pick the entity a page
 * shows, such as the source a source editor opens: a change of one of them builds the page afresh
 * and runs its resolvers again, as a path parameter does. The router decides to run resolvers
 * apart from this strategy, so without `runGuardsAndResolvers` the new page would get the old data.
 */
export function identityQueryParams(...names: string[]): Pick<Route, "data" | "runGuardsAndResolvers"> {
    return { data: { [IDENTITY_QUERY_PARAMS_KEY]: names }, runGuardsAndResolvers: "paramsOrQueryParamsChange" };
}

/**
 * Keeps a routed component only while its path parameters, and the query parameters its route
 * names with `identityQueryParams`, stay the same, so moving to another account, dataset, flow or
 * block builds the page afresh, as a page load does. A reused component receives its new resolver
 * data as inputs only after the navigation has ended, so anything it built from the old data, such
 * as a form, stayed on the previous dataset. A change of other query parameters, such as a page or
 * a filter, still reuses the component.
 */
@Injectable()
export class KamuRouteReuseStrategy extends BaseRouteReuseStrategy {
    public override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return (
            future.routeConfig === curr.routeConfig &&
            sameParams(future.params, curr.params) &&
            identityQueryParamNames(future.data).every(
                (name) => future.queryParamMap.get(name) === curr.queryParamMap.get(name),
            )
        );
    }
}

function sameParams(a: Params, b: Params): boolean {
    const aKeys = Object.keys(a);
    return aKeys.length === Object.keys(b).length && aKeys.every((key) => a[key] === b[key]);
}

function identityQueryParamNames(data: Data): string[] {
    const names: unknown = data[IDENTITY_QUERY_PARAMS_KEY];
    return Array.isArray(names) ? names.filter((name) => typeof name === "string") : [];
}
