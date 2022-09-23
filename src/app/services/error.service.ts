import { KamuError, KamuErrorHandler } from "./../common/errors";
import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { ModalService } from "../components/modal/modal.service";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    private errorDescription = "";
    private kamuHandlerError = new KamuErrorHandler(
        this.errorDescription,
        this.navigationService,
        this.modalService,
    );

    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService,
    ) {}

    public processError(error: KamuError): void {
        error.accept(this.kamuHandlerError);
    }
}
