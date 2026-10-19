/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ErrorHandler, inject, Injectable, Injector, NgZone } from "@angular/core";

import { logError } from "@common/helpers/app.helpers";
import { KamuError, KamuErrorHandler } from "@common/values/errors";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class ErrorHandlerService implements ErrorHandler {
    private injector = inject(Injector);
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);
    private ngZone = inject(NgZone);
    private kamuHandlerError = new KamuErrorHandler(this.injector, this.navigationService, this.loggedUserService);

    public handleError(error: unknown): void {
        if (error instanceof KamuError) {
            this.processKamuError(error);
        } else {
            logError(error);
        }
    }

    private processKamuError(error: KamuError): void {
        this.ngZone.run(() => error.accept(this.kamuHandlerError));
    }
}
