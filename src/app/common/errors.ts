import { ModalService } from "../components/modal/modal.service";
import { NavigationService } from "../services/navigation.service";
import { ApolloError } from "@apollo/client/core";
import { ErrorTexts } from "./errors.text";
import { logError, promiseWithCatch } from "./app.helpers";
import { LoggedUserService } from "../auth/logged-user.service";

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

export class SqlExecutionError extends KamuError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitSqlExecutionError(this);
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

export class AccountNotFoundError extends KamuError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitAccountNotFoundError(this);
    }
}

export abstract class KamuMultiError extends KamuError {
    public readonly errors: readonly Error[];

    constructor(errors: readonly Error[]) {
        super();
        this.errors = errors;
    }

    public get compactMessage(): string {
        return this.errors
            .map((e) => e.message)
            .reduce((previousValue, currentValue) => previousValue + ". " + currentValue);
    }
}

export class DatasetOperationError extends KamuMultiError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitDatasetOperationError(this);
    }
}

export class AuthenticationError extends KamuMultiError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitAuthenticationError(this);
    }
}

interface KamuErrorVisitor {
    visitSqlExecutionError(e: SqlExecutionError): void;
    visitInvalidSqlError(e: InvalidSqlError): void;
    visitDatasetNotFoundError(e: DatasetNotFoundError): void;
    visitAccountNotFoundError(e: AccountNotFoundError): void;
    visitDatasetOperationError(e: DatasetOperationError): void;
    visitApolloError(e: ApolloError): void;
    visitAuthenticationError(e: AuthenticationError): void;
}

export class KamuErrorHandler implements KamuErrorVisitor {
    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
        private loggedUserService: LoggedUserService,
    ) {}

    public visitApolloError(e: ApolloError): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: e.networkError ? ErrorTexts.ERROR_NETWORK_DESCRIPTION : ErrorTexts.ERROR_TECHNICAL_SUPPORT,
                yesButtonText: "Close",
            }),
        );
    }

    public visitDatasetNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitAccountNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitDatasetOperationError(e: DatasetOperationError): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_DATASET_OPERATION_FAILED,
                message: e.compactMessage,
                yesButtonText: "Close",
            }),
        );
    }

    public visitInvalidSqlError(e: InvalidSqlError): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: `${ErrorTexts.ERROR_INVALID_SQL_QUERY}: ${e.message}`,
                yesButtonText: "Close",
            }),
        );
    }

    public visitSqlExecutionError(e: SqlExecutionError): void {
        promiseWithCatch(
            this.modalService.error({
                title: ErrorTexts.ERROR_TITLE_REQUEST_FAILED,
                message: e.message
                    ? `${ErrorTexts.ERROR_EXECUTING_SQL_QUERY}: ${e.message}`
                    : ErrorTexts.ERROR_EXECUTING_SQL_QUERY,
                yesButtonText: "Close",
            }),
        );
    }

    public visitAuthenticationError(authenticationError: AuthenticationError): void {
        if (authenticationError.errors.length > 0) {
            authenticationError.errors.forEach((e) => logError(e));
        } else {
            logError(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        }
        this.loggedUserService.terminateSession();
    }
}
