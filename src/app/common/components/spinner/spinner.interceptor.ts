/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";

import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { environment } from "@env/environment";
import { SpinnerService } from "@common/components/spinner/spinner.service";
import AppValues from "@common/values/app.values";

export class SpinnerInterceptor implements HttpInterceptor {
    private spinnerService = inject(SpinnerService);
    private timer: NodeJS.Timeout;
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const skipGlobalLoader = Boolean(req.headers.get(AppValues.HEADERS_SKIP_LOADING_KEY));
        if (req.url.includes("/assets") || skipGlobalLoader) {
            return next.handle(req);
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.spinnerService.show(), environment.delay_http_request_ms);
        return next.handle(req).pipe(
            finalize(() => {
                this.spinnerService.hide();
                clearTimeout(this.timer);
            }),
        );
    }
}
