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
                : ErrorTexts.ERROR_TECHNICAL_SUPPORT;
        }
        if (error.message === ErrorTexts.ERROR_SERVER_BAD_SQL_QUERY) {
            this.errorDescription = ErrorTexts.ERROR_BAD_SQL_QUERY;
        }
        if (error.message === ErrorTexts.ERROR_DATASET_NOT_FOUND) {
            this.errorDescription = ErrorTexts.ERROR_DATASET_NOT_FOUND;
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
