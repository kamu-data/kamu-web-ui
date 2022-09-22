import { ApolloError } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import { ModalService } from "../components/modal/modal.service";
import { logError } from "../common/app.helpers";
import { ErrorTexts } from "../common/errors.text";
import { NavigationService } from "./navigation.service";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    private errorDescription = "";

    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService,
    ) {}

    public processError(error: Error, datasetName?: string): void {
        const errorMapper: { [key in string]: string } = {
            [ErrorTexts.ERROR_SERVER_BAD_SQL_QUERY]:
                ErrorTexts.ERROR_SERVER_BAD_SQL_QUERY,
            [ErrorTexts.ERROR_DATASET_NOT_FOUND]: `${datasetName ?? ""} ${
                ErrorTexts.ERROR_DATASET_NOT_FOUND
            }`,
        };
        this.errorDescription = error.message;
        if (error instanceof ApolloError) {
            this.errorDescription = error.networkError
                ? ErrorTexts.ERROR_NETWORK_DESCRIPTION
                : ErrorTexts.ERROR_TECHNICAL_SUPPORT;
        }
        if (error.message in errorMapper) {
            this.errorDescription = errorMapper[error.message];
        }
        this.modalService
            .error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: this.errorDescription,
                yesButtonText: "Close",
            })
            .then(() =>
                error.message === ErrorTexts.ERROR_DATASET_NOT_FOUND
                    ? this.navigationService.navigateToHome()
                    : null,
            )
            .catch((e) => logError(e));
    }
}
