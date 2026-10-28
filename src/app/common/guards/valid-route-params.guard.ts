/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { MaybeUndefined } from "@interface/app.types";

import { NavigationService } from "src/app/services/navigation.service";

const validatedParamsByGuard = new WeakMap<object, readonly string[]>();

/**
 * A guard that shows the page-not-found view, keeping the URL, when a path parameter of the route
 * is not in the format its check accepts. It runs before the route's resolvers, so a malformed
 * value never reaches the API.
 */
export function validRouteParams(checks: Record<string, (value: string) => boolean>): CanActivateFn {
    const guard: CanActivateFn = (route) => {
        const navigationService = inject(NavigationService);

        const isValid = Object.entries(checks).every(([param, check]) => {
            const value = route.paramMap.get(param);
            return value !== null && check(value);
        });
        return isValid || navigationService.pageNotFoundRedirect();
    };
    validatedParamsByGuard.set(guard, Object.keys(checks));
    return guard;
}

/** The path parameters a guard built by `validRouteParams` checks, or `undefined` for any other guard */
export function paramsValidatedBy(guard: unknown): MaybeUndefined<readonly string[]> {
    return typeof guard === "function" ? validatedParamsByGuard.get(guard) : undefined;
}
