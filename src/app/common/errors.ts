import { ModalService } from "./../components/modal/modal.service";
import { NavigationService } from "./../services/navigation.service";
import { ApolloError } from "@apollo/client/core";
import { ErrorTexts } from "./errors.text";
import { logError, promiseWithCatch } from "./app.helpers";
import { AuthApi } from "../api/auth.api";

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
        visitor.visitApolloError(this.apolloError);
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

export class AuthenticationError extends KamuError {
    public readonly errors: readonly Error[];

    constructor(errors: readonly Error[]) {
        super();
        this.errors = errors;
    }

    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitAuthenticationError(this);
    }
}

interface KamuErrorVisitor {
    visitInvalidSqlError(e: InvalidSqlError): void;
    visitDatasetNotFoundError(e: DatasetNotFoundError): void;
    visitApolloError(e: ApolloError): void;
    visitAuthenticationError(e: AuthenticationError): void;
}

export class KamuErrorHandler implements KamuErrorVisitor {
    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
        private authApi: AuthApi,
    ) {}

    public visitApolloError(e: ApolloError): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: e.networkError
                    ? ErrorTexts.ERROR_NETWORK_DESCRIPTION
                    : ErrorTexts.ERROR_TECHNICAL_SUPPORT,
                yesButtonText: "Close",
            }),
        );
    }

    public visitDatasetNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitInvalidSqlError(): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: ErrorTexts.ERROR_BAD_SQL_QUERY,
                yesButtonText: "Close",
            }),
        );
    }

    public visitAuthenticationError(
        authenticationError: AuthenticationError,
    ): void {
        if (authenticationError.errors.length > 0) {
            authenticationError.errors.forEach((e) => logError(e));
        } else {
            logError(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        }
        this.authApi.terminateSession();
    }
}
