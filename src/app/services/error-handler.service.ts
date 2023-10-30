import { AuthenticationError, CustomApolloError, KamuError, KamuErrorHandler } from "../common/errors";
import { NavigationService } from "src/app/services/navigation.service";
import { ErrorHandler, Inject, Injectable, Injector, NgZone } from "@angular/core";
import { logError } from "../common/app.helpers";
import { ApolloError } from "@apollo/client/core";
import { LoggedUserService } from "../auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class ErrorHandlerService implements ErrorHandler {
    public static readonly APOLLO_ERROR_INVALID_TOKEN = "Invalid access token";
    public static readonly APOLLO_ERROR_EXPIRED_TOKEN = "Expired access token";

    private kamuHandlerError = new KamuErrorHandler(this.injector, this.navigationService, this.loggedUserService);

    constructor(
        @Inject(Injector) private injector: Injector,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
        private ngZone: NgZone,
    ) {}

    public handleError(error: unknown): void {
        if (error instanceof KamuError) {
            this.processKamuError(error);
        } else if (error instanceof ApolloError) {
            this.processApolloError(error);
        } else {
            logError(error);
        }
    }

    private processKamuError(error: KamuError): void {
        this.ngZone.run(() => error.accept(this.kamuHandlerError));
    }

    private processApolloError(apolloError: ApolloError) {
        if (
            apolloError.message === ErrorHandlerService.APOLLO_ERROR_EXPIRED_TOKEN ||
            apolloError.message == ErrorHandlerService.APOLLO_ERROR_INVALID_TOKEN
        ) {
            this.processKamuError(new AuthenticationError([apolloError]));
        } else {
            this.processKamuError(new CustomApolloError(apolloError));
        }
    }
}
