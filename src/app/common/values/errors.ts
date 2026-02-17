/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injector } from "@angular/core";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { GraphQLFormattedError } from "graphql";
import { ToastrService } from "ngx-toastr";

import { LoggedUserService } from "../../auth/logged-user.service";
import { NavigationService } from "../../services/navigation.service";
import { logError } from "../helpers/app.helpers";
import { ErrorTexts } from "./errors.text";

export abstract class KamuError extends Error {
    public abstract accept(visitor: KamuErrorVisitor): void;
}

export class CustomApolloError extends KamuError {
    private apolloError: CombinedGraphQLErrors;

    public constructor(apolloError: CombinedGraphQLErrors) {
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
    public readonly errors: ReadonlyArray<GraphQLFormattedError>;

    public constructor(errors: ReadonlyArray<GraphQLFormattedError>) {
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

export class FileUploadError extends KamuMultiError {
    public accept(visitor: KamuErrorVisitor): void {
        visitor.visitFileUploadError(this);
    }
}

interface KamuErrorVisitor {
    visitSqlExecutionError(e: SqlExecutionError): void;
    visitInvalidSqlError(e: InvalidSqlError): void;
    visitDatasetNotFoundError(e: DatasetNotFoundError): void;
    visitAccountNotFoundError(e: AccountNotFoundError): void;
    visitDatasetOperationError(e: DatasetOperationError): void;
    visitApolloError(e: CombinedGraphQLErrors): void;
    visitAuthenticationError(e: AuthenticationError): void;
    visitFileUploadError(e: FileUploadError): void;
}

export class KamuErrorHandler implements KamuErrorVisitor {
    public constructor(
        private injector: Injector,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
    ) {}

    // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public visitApolloError(_e: CombinedGraphQLErrors): void {
        this.toastrService.error("", ErrorTexts.ERROR_TECHNICAL_SUPPORT, {
            disableTimeOut: "timeOut",
        });
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
        this.toastrService.error("", e.message, { timeOut: 3000 });
    }

    public visitSqlExecutionError(e: SqlExecutionError): void {
        this.toastrService.error("", e.message, {
            timeOut: 3000,
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

    public visitFileUploadError(e: FileUploadError): void {
        this.toastrService.error(e.compactMessage, "", { disableTimeOut: "timeOut" });
    }
}
