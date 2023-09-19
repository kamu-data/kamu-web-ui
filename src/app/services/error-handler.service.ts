import { CustomApolloError, KamuError, KamuErrorHandler } from "../common/errors";
import { NavigationService } from "src/app/services/navigation.service";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { ModalService } from "../components/modal/modal.service";
import { logError } from "../common/app.helpers";
import { ApolloError } from "@apollo/client/core";
import { LoggedUserService } from "../auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class ErrorHandlerService implements ErrorHandler {
    private kamuHandlerError = new KamuErrorHandler(this.navigationService, this.modalService, this.loggedUserService);

    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
        private ngZone: NgZone,
    ) {}

    public handleError(error: unknown): void {
        if (error instanceof KamuError) {
            this.processKamuError(error);
        } else if (error instanceof ApolloError) {
            this.processKamuError(new CustomApolloError(error));
        } else {
            logError(error);
        }
    }

    private processKamuError(error: KamuError): void {
        this.ngZone.run(() => error.accept(this.kamuHandlerError));
    }
}
