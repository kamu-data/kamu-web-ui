import { NavigationService } from "../services/navigation.service";
import { ApolloError } from "@apollo/client/core";
import { ErrorTexts } from "./errors.text";
import { logError } from "./app.helpers";
import { LoggedUserService } from "../auth/logged-user.service";
import { Injector } from "@angular/core";
import { ToastrService } from "ngx-toastr";

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
        return this.errors.length > 0
            ? this.errors
                  .map((e) => e.message)
                  .reduce((previousValue, currentValue) => previousValue + ". " + currentValue)
            : "";
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
        private injector: Injector,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
    ) {}

    // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public visitApolloError(e: ApolloError): void {
        this.toastrService.error(
            "",
            e.networkError ? ErrorTexts.ERROR_NETWORK_DESCRIPTION : ErrorTexts.ERROR_TECHNICAL_SUPPORT,
            {
                disableTimeOut: "timeOut",
            },
        );
    }

    public visitDatasetNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitAccountNotFoundError(): void {
        this.navigationService.navigateToPageNotFound();
    }

    public visitDatasetOperationError(e: DatasetOperationError): void {
        this.toastrService.error(e.compactMessage);
    }

    public visitInvalidSqlError(e: InvalidSqlError): void {
        this.toastrService.error("", e.message, { timeOut: 5000 });
    }

    public visitSqlExecutionError(e: SqlExecutionError): void {
        this.toastrService.error("", e.message, {
            timeOut: 5000,
        });
    }

    public visitAuthenticationError(authenticationError: AuthenticationError): void {
        this.loggedUserService.terminateSession();

        if (authenticationError.errors.length > 0) {
            authenticationError.errors.forEach((e) => logError(e));
            this.toastrService.error(authenticationError.compactMessage);
        } else {
            logError(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
            this.toastrService.error(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        }
    }
}
