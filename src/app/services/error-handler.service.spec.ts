import { ErrorTexts } from "../common/errors.text";
import { ApolloError } from "@apollo/client/core";
import {
    AccountNotFoundError,
    AuthenticationError,
    DatasetNotFoundError,
    DatasetOperationError,
    InvalidSqlError,
    SqlExecutionError,
} from "../common/errors";
import { ModalService } from "../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorHandlerService } from "./error-handler.service";
import { NavigationService } from "./navigation.service";
import { LoggedUserService } from "../auth/logged-user.service";

describe("ErrorHandlerService", () => {
    let service: ErrorHandlerService;
    let modalService: ModalService;
    let navigationService: NavigationService;

    const loggedUserServiceMock = {
        terminateSession: () => {
            /* Intentionally empty */
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ModalService,
                NavigationService,
                { provide: LoggedUserService, useValue: loggedUserServiceMock },
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        modalService = TestBed.inject(ModalService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should show modal window when SQL query execution fails", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        service.handleError(new SqlExecutionError());
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: ErrorTexts.ERROR_EXECUTING_SQL_QUERY,
            }),
        );
    });

    it("should show modal window when SQL query execution fails with extra error message", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        const errorText = "executing SQL failed";
        service.handleError(new SqlExecutionError(errorText));
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: `${ErrorTexts.ERROR_EXECUTING_SQL_QUERY}: ${errorText}`,
            }),
        );
    });

    it("should show modal window when SQL query is invalid", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        const errorText = "bad SQL";
        service.handleError(new InvalidSqlError(errorText));
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: `${ErrorTexts.ERROR_INVALID_SQL_QUERY}: ${errorText}`,
            }),
        );
    });

    it("should show redirect to 404 page on dataset not found", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.stub();
        const navigationServiceSpy: jasmine.Spy = spyOn(navigationService, "navigateToPageNotFound").and.stub();

        service.handleError(new DatasetNotFoundError());

        expect(modalServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show redirect to 404 page on account not found", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.stub();
        const navigationServiceSpy: jasmine.Spy = spyOn(navigationService, "navigateToPageNotFound").and.stub();

        service.handleError(new AccountNotFoundError());

        expect(modalServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show modal window when dataset operation fails", () => {
        const errorText = "Some dataset error";
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        service.handleError(new DatasetOperationError([new Error(errorText)]));
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should show modal window when connection was lost", () => {
        const mockErrorMessage = "Mock apollo error message";
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        service.handleError(
            new ApolloError({
                errorMessage: mockErrorMessage,
                networkError: new Error("Problem with internet"),
            }),
        );
        service.handleError(
            new ApolloError({
                errorMessage: mockErrorMessage,
            }),
        );
        expect(modalServiceSpy).toHaveBeenCalledTimes(2);
    });

    it("should log authentication errors and terminate session", () => {
        const consoleErrorSpy: jasmine.Spy = spyOn(console, "error").and.stub();
        const authApiTerminateSessionSpy: jasmine.Spy = spyOn(loggedUserServiceMock, "terminateSession").and.stub();
        service.handleError(new AuthenticationError([]));
        expect(consoleErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        expect(authApiTerminateSessionSpy).toHaveBeenCalledWith();
    });

    it("should log unknown errors", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        const consoleErrorSpy: jasmine.Spy = spyOn(console, "error").and.stub();
        const unknownError = new Error("Some Unknown Error");
        service.handleError(unknownError);
        expect(modalServiceSpy).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(unknownError);
    });
});
