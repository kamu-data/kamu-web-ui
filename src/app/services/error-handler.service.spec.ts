/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ErrorTexts } from "../common/values/errors.text";
import {
    AccountNotFoundError,
    AuthenticationError,
    DatasetNotFoundError,
    DatasetOperationError,
    InvalidSqlError,
    SqlExecutionError,
} from "../common/values/errors";
import { ModalService } from "../common/components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorHandlerService } from "./error-handler.service";
import { NavigationService } from "./navigation.service";
import { LoggedUserService } from "../auth/logged-user.service";
import { provideToastr, ToastrService } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("ErrorHandlerService", () => {
    let service: ErrorHandlerService;
    let toastrService: ToastrService;
    let navigationService: NavigationService;

    const loggedUserServiceMock = {
        terminateSession: () => {
            /* Intentionally empty */
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideAnimations(),
                provideToastr(),
                ModalService,
                NavigationService,
                { provide: LoggedUserService, useValue: loggedUserServiceMock },
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        toastrService = TestBed.inject(ToastrService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should show modal window when SQL query execution fails", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.callThrough();
        service.handleError(new SqlExecutionError());
        expect(toastrServiceSpy).toHaveBeenCalledWith("", "", { timeOut: 3000 });
    });

    it("should show modal window when SQL query execution fails with extra error message", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.callThrough();
        const errorText = "executing SQL failed";
        service.handleError(new SqlExecutionError(errorText));
        expect(toastrServiceSpy).toHaveBeenCalledWith("", errorText, { timeOut: 3000 });
    });

    it("should show modal window when SQL query is invalid", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.callThrough();
        const errorText = "bad SQL";
        service.handleError(new InvalidSqlError(errorText));
        expect(toastrServiceSpy).toHaveBeenCalledWith("", errorText, { timeOut: 3000 });
    });

    it("should show redirect to 404 page on dataset not found", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.stub();
        const navigationServiceSpy: jasmine.Spy = spyOn(navigationService, "navigateToPageNotFound").and.stub();

        service.handleError(new DatasetNotFoundError());

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show redirect to 404 page on account not found", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.stub();
        const navigationServiceSpy: jasmine.Spy = spyOn(navigationService, "navigateToPageNotFound").and.stub();

        service.handleError(new AccountNotFoundError());

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show modal window when dataset operation fails", () => {
        const errorText = "Some dataset error";
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.callThrough();
        service.handleError(new DatasetOperationError([new Error(errorText)]));
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should log authentication errors, terminate session, and show Toastr", () => {
        const consoleErrorSpy: jasmine.Spy = spyOn(console, "error").and.stub();
        const authApiTerminateSessionSpy: jasmine.Spy = spyOn(loggedUserServiceMock, "terminateSession").and.stub();
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.stub();

        service.handleError(new AuthenticationError([]));

        expect(consoleErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        expect(authApiTerminateSessionSpy).toHaveBeenCalledWith();
        expect(toastrServiceSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);

        consoleErrorSpy.calls.reset();
        authApiTerminateSessionSpy.calls.reset();
        toastrServiceSpy.calls.reset();

        const ERROR_TEXT = "some authentication error";
        const ERROR = new Error(ERROR_TEXT);
        service.handleError(new AuthenticationError([ERROR]));

        expect(consoleErrorSpy).toHaveBeenCalledWith(ERROR);
        expect(authApiTerminateSessionSpy).toHaveBeenCalledWith();
        expect(toastrServiceSpy).toHaveBeenCalledWith(ERROR_TEXT);
    });

    it("should log unknown errors", () => {
        const toastrServiceSpy: jasmine.Spy = spyOn(toastrService, "error").and.callThrough();
        const consoleErrorSpy: jasmine.Spy = spyOn(console, "error").and.stub();
        const unknownError = new Error("Some Unknown Error");

        service.handleError(unknownError);

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(unknownError);
    });
});
