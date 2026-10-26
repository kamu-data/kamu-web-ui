/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { provideToastr, ToastrService } from "ngx-toastr";
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import {
    AccountNotFoundError,
    AuthenticationError,
    DatasetNotFoundError,
    DatasetOperationError,
    FileUploadError,
    InvalidSqlError,
    SqlExecutionError,
} from "@common/values/errors";
import { ErrorTexts } from "@common/values/errors.text";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { NavigationService } from "src/app/services/navigation.service";

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
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        service.handleError(new SqlExecutionError());
        expect(toastrServiceSpy).toHaveBeenCalledWith("", "", { timeOut: 3000 });
    });

    it("should show modal window when SQL query execution fails with extra error message", () => {
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        const errorText = "executing SQL failed";
        service.handleError(new SqlExecutionError(errorText));
        expect(toastrServiceSpy).toHaveBeenCalledWith("", errorText, { timeOut: 3000 });
    });

    it("should show modal window when SQL query is invalid", () => {
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        const errorText = "bad SQL";
        service.handleError(new InvalidSqlError(errorText));
        expect(toastrServiceSpy).toHaveBeenCalledWith("", errorText, { timeOut: 3000 });
    });

    it("should show redirect to 404 page on dataset not found", () => {
        const toastrServiceSpy: Mock = stubMethod(toastrService, "error");
        const navigationServiceSpy: Mock = vi
            .spyOn(navigationService, "navigateToPageNotFound")
            .mockImplementation(() => {});

        service.handleError(new DatasetNotFoundError());

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show redirect to 404 page on account not found", () => {
        const toastrServiceSpy: Mock = stubMethod(toastrService, "error");
        const navigationServiceSpy: Mock = vi
            .spyOn(navigationService, "navigateToPageNotFound")
            .mockImplementation(() => {});

        service.handleError(new AccountNotFoundError());

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(navigationServiceSpy).toHaveBeenCalledWith();
    });

    it("should show modal window when dataset operation fails", () => {
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        service.handleError(new DatasetOperationError([{ message: "First" }, { message: "Second" }]));
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSpy).toHaveBeenCalledWith("First. Second");
    });

    it("should show a toast that stays when a file upload fails", () => {
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        service.handleError(new FileUploadError([{ message: "Upload failed" }]));
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSpy).toHaveBeenCalledWith("Upload failed", "", { disableTimeOut: "timeOut" });
    });

    it("should log authentication errors, terminate session, and show Toastr", () => {
        const consoleErrorSpy: Mock = vi.spyOn(console, "error").mockImplementation(() => {});
        const authApiTerminateSessionSpy: Mock = vi
            .spyOn(loggedUserServiceMock, "terminateSession")
            .mockImplementation(() => {});
        const toastrServiceSpy: Mock = stubMethod(toastrService, "error");

        service.handleError(new AuthenticationError([]));

        expect(consoleErrorSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);
        expect(authApiTerminateSessionSpy).toHaveBeenCalledWith();
        expect(toastrServiceSpy).toHaveBeenCalledWith(ErrorTexts.ERROR_UNKNOWN_AUTHENTICATION);

        consoleErrorSpy.mockClear();
        authApiTerminateSessionSpy.mockClear();
        toastrServiceSpy.mockClear();

        const ERROR_TEXT = "some authentication error";
        const ERROR = new Error(ERROR_TEXT);
        service.handleError(new AuthenticationError([ERROR]));

        expect(consoleErrorSpy).toHaveBeenCalledWith(ERROR);
        expect(authApiTerminateSessionSpy).toHaveBeenCalledWith();
        expect(toastrServiceSpy).toHaveBeenCalledWith(ERROR_TEXT);
    });

    it("should log unknown errors", () => {
        const toastrServiceSpy: Mock = vi.spyOn(toastrService, "error");
        const consoleErrorSpy: Mock = vi.spyOn(console, "error").mockImplementation(() => {});
        const unknownError = new Error("Some Unknown Error");

        service.handleError(unknownError);

        expect(toastrServiceSpy).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(unknownError);
    });
});
