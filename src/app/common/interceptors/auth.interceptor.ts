/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { AppConfigService } from "src/app/app-config.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private localStorageService = inject(LocalStorageService);
    private appConfigService = inject(AppConfigService);

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = this.localStorageService.accessToken;
        if (accessToken && request.url.startsWith(this.appConfigService.apiServerHttpUrl)) {
            const authReq = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return next.handle(authReq);
        }

        return next.handle(request);
    }
}
