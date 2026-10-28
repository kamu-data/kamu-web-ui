/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, Params } from "@angular/router";

/**
 * Keeps a routed component only while its path parameters stay the same, so moving to another
 * account, dataset, flow or block builds the page afresh, as a page load does. A reused component
 * receives its new resolver data as inputs only after the navigation has ended, so anything it
 * built from the old data, such as a form, stayed on the previous dataset. A change of query
 * parameters, such as a page or a filter, still reuses the component.
 */
@Injectable()
export class KamuRouteReuseStrategy extends BaseRouteReuseStrategy {
    public override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig && sameParams(future.params, curr.params);
    }
}

function sameParams(a: Params, b: Params): boolean {
    const aKeys = Object.keys(a);
    return aKeys.length === Object.keys(b).length && aKeys.every((key) => a[key] === b[key]);
}
