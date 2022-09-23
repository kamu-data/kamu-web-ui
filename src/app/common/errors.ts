import { ModalService } from "./../components/modal/modal.service";
import { NavigationService } from "./../services/navigation.service";
import { ApolloError } from "@apollo/client/core";
import { ErrorTexts } from "./errors.text";
import { logError } from "./app.helpers";

export abstract class KamuError extends Error {
    abstract accept(visitor: KamuErrorVisitor): void;
}

export class CustomApolloError extends KamuError {
    private apolloError: ApolloError;
    constructor(apolloError: ApolloError) {
        super();
        this.apolloError = apolloError;
    }
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitApolloError(this, this.apolloError);
    }
}

export class InvalidSqlError extends KamuError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitInvalidSqlError(this);
    }
}

export class DatasetNotFoundError extends KamuError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitDatasetNotFoundError(this);
    }
}

interface KamuErrorVisitor {
    visitInvalidSqlError(e?: InvalidSqlError): void;
    visitDatasetNotFoundError(e?: DatasetNotFoundError): void;
    visitApolloError(e: CustomApolloError, apolloError: ApolloError): void;
}

export class KamuErrorHandler implements KamuErrorVisitor {
    errorMessage: string;
    navigationService: NavigationService;
    modalService: ModalService;
    constructor(
        errorMessage: string,
        navigationService: NavigationService,
        modalService: ModalService,
    ) {
        this.errorMessage = errorMessage;
        this.navigationService = navigationService;
        this.modalService = modalService;
    }

    public visitApolloError(
        e: CustomApolloError,
        apolloError: ApolloError,
    ): void {
        this.modalService
            .error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: apolloError.networkError
                    ? ErrorTexts.ERROR_NETWORK_DESCRIPTION
                    : ErrorTexts.ERROR_TECHNICAL_SUPPORT,
                yesButtonText: "Close",
            })
            .catch((e) => logError(e));
    }

    public visitDatasetNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitInvalidSqlError(): void {
        this.modalService
            .error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: ErrorTexts.ERROR_BAD_SQL_QUERY,
                yesButtonText: "Close",
            })
            .catch((e) => logError(e));
    }
}
