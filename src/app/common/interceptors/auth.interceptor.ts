/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AppConfigService } from "src/app/app-config.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const localStorageService = inject(LocalStorageService);
    const appConfigService = inject(AppConfigService);

    const accessToken = localStorageService.accessToken;
    if (accessToken && isApiServerUrl(request.url, appConfigService.apiServerHttpUrl)) {
        return next(request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
    }
    return next(request);
};

/**
 * Whether `url` points at the API server: the same origin, and a path inside the server's base
 * path. A plain prefix check would also accept hosts such as `api.example.com.evil.com`.
 */
function isApiServerUrl(url: string, apiServerHttpUrl: string): boolean {
    const target = new URL(url, window.location.origin);
    const apiServer = new URL(apiServerHttpUrl, window.location.origin);
    const basePath = apiServer.pathname.replace(/\/+$/, "");
    return (
        target.origin === apiServer.origin &&
        (basePath === "" || target.pathname === basePath || target.pathname.startsWith(`${basePath}/`))
    );
}
