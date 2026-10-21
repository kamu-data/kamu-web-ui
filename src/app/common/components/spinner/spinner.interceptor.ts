/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { finalize } from "rxjs";

import { environment } from "@env/environment";
import { SpinnerService } from "@common/components/spinner/spinner.service";
import AppValues from "@common/values/app.values";

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
    const spinnerService = inject(SpinnerService);

    const skipGlobalLoader = Boolean(req.headers.get(AppValues.HEADERS_SKIP_LOADING_KEY));
    if (req.url.includes("/assets") || skipGlobalLoader) {
        return next(req);
    }
    spinnerService.requestStarted(environment.delay_http_request_ms);
    return next(req).pipe(finalize(() => spinnerService.requestEnded()));
};
