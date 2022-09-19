import { ApolloError } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import { ModalService } from "../components/modal/modal.service";
import { logError } from "../common/app.helpers";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    private errorTitle = "Request was failed";
    private errorNetwork = "Check the internet connection";
    private errorDescription = "";

    constructor(private modalService: ModalService) {}

    public processError(error: ApolloError): void {
        this.errorDescription = error.networkError
            ? this.errorNetwork
            : error.message;
        this.modalService
            .error({
                title: this.errorTitle,
                message: this.errorDescription,
                yesButtonText: "Close",
            })
            .catch((e) => logError(e));
    }
}
