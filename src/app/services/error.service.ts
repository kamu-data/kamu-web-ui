import { ErrorTexts } from "./../common/app.values";
import { ApolloError } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import { ModalService } from "../components/modal/modal.service";
import { logError } from "../common/app.helpers";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    private errorDescription = "";

    constructor(private modalService: ModalService) {}

    public processError(error: Error): void {
        this.errorDescription = error.message;
        if (error instanceof ApolloError) {
            this.errorDescription = error.networkError
                ? ErrorTexts.ERROR_NETWORK_DESCRIPTION
                : error.message;
        }
        this.modalService
            .error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: this.errorDescription,
                yesButtonText: "Close",
            })
            .catch((e) => logError(e));
    }
}
