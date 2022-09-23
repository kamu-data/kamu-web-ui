import { ErrorTexts } from "./../common/errors.text";
import { ApolloError } from "@apollo/client/core";
import { CustomApolloError, InvalidSqlError } from "./../common/errors";
/* eslint-disable @typescript-eslint/dot-notation */
import { ModalService } from "./../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorService } from "./error.service";

describe("ErrorService", () => {
    let service: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService],
        });
        service = TestBed.inject(ErrorService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should show modal window when error sql query incorrect", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(
            service["modalService"],
            "error",
        ).and.callThrough();
        service.processError(new InvalidSqlError());
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: ErrorTexts.ERROR_BAD_SQL_QUERY,
            }),
        );
    });

    it("should show modal window when connection was lost", async () => {
        const mockErrorMessage = "Mock apollo error message";
        const modalServiceSpy: jasmine.Spy = spyOn(
            service["modalService"],
            "error",
        ).and.callThrough();
        service.processError(
            new CustomApolloError(
                new ApolloError({
                    errorMessage: mockErrorMessage,
                    networkError: new Error("Problem with internet"),
                }),
            ),
        );
        await expect(modalServiceSpy).toHaveBeenCalled();
    });
});
