/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { KamuError, KamuErrorHandler } from "../common/values/errors";
import { NavigationService } from "src/app/services/navigation.service";
import { ErrorHandler, Inject, Injectable, Injector, NgZone } from "@angular/core";
import { logError } from "../common/helpers/app.helpers";
import { LoggedUserService } from "../auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class ErrorHandlerService implements ErrorHandler {
    private kamuHandlerError = new KamuErrorHandler(this.injector, this.navigationService, this.loggedUserService);

    public constructor(
        @Inject(Injector) private injector: Injector,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
        private ngZone: NgZone,
    ) {}

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
