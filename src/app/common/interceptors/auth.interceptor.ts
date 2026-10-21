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
    if (accessToken && request.url.startsWith(appConfigService.apiServerHttpUrl)) {
        return next(request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
    }
    return next(request);
};
