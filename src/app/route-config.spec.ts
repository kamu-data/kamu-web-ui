/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Route, Routes } from "@angular/router";

import { isObservable, lastValueFrom } from "rxjs";

import { paramsValidatedBy } from "@common/guards/valid-route-params.guard";

import { ANONYMOUS_GUARDED_ROUTES, PUBLIC_ROUTES } from "src/app/app-routing";

interface RouteEntry {
    fullPath: string;
    route: Route;
    children: Routes;
}

async function loadedChildren(route: Route): Promise<Routes> {
    if (route.children) {
        return route.children;
    }
    if (!route.loadChildren) {
        return [];
    }
    const callbackResult = route.loadChildren();
    const loaded = isObservable(callbackResult) ? await lastValueFrom(callbackResult) : await callbackResult;
    if (!Array.isArray(loaded)) {
        throw new Error(`Route "${route.path}" loads something other than a Routes array`);
    }
    return loaded;
}

async function collectRoutes(routes: Routes, parentPath: string): Promise<RouteEntry[]> {
    const entries: RouteEntry[] = [];
    for (const route of routes) {
        const fullPath = [parentPath, route.path].filter(Boolean).join("/");
        const children = await loadedChildren(route);
        entries.push({ fullPath, route, children }, ...(await collectRoutes(children, fullPath)));
    }
    return entries;
}

/**
 * Checks every route in the app, lazy ones included, against the URL rules: a path parameter is
 * checked by a guard before anything reads it, and a route that can match a URL with no segment
 * left for its children has a child for that URL, since the router would otherwise render it with
 * an empty outlet.
 */
describe("Route configuration", () => {
    let entries: RouteEntry[];

    beforeAll(async () => {
        entries = await collectRoutes([...PUBLIC_ROUTES, ...ANONYMOUS_GUARDED_ROUTES], "");
    });

    it("validates every path parameter with a validRouteParams guard on the route that declares it", () => {
        const unchecked = entries.flatMap(({ fullPath, route }) => {
            const declared = (route.path ?? "")
                .split("/")
                .filter((segment) => segment.startsWith(":"))
                .map((segment) => segment.slice(1));
            const validated = (route.canActivate ?? []).flatMap((guard) => paramsValidatedBy(guard) ?? []);
            return declared.filter((param) => !validated.includes(param)).map((param) => `${fullPath} → :${param}`);
        });

        expect(unchecked).toEqual([]);
    });

    it("gives every parent route a child for the URL that ends at the parent", () => {
        const withoutDefault = entries
            .filter(({ route, children }) => children.length > 0 && !isPassThroughGroup(route))
            .filter(({ children }) => !children.some((child) => child.path === ""))
            .map(({ fullPath }) => fullPath || "/");

        expect(withoutDefault).toEqual([]);
    });

    it("finds the lazy routes too", () => {
        const paths = entries.map(({ fullPath }) => fullPath);

        expect(paths).toContain(":accountName/:datasetName/flow-details/:flow-id");
        expect(paths.some((path) => path.endsWith("webhooks/rotate-secret/:webhookId"))).toBe(true);
    });
});

/** An empty-path route without a component only groups its children; the URL ending there belongs to the route above */
function isPassThroughGroup(route: Route): boolean {
    return route.path === "" && !route.component && !route.loadComponent;
}
