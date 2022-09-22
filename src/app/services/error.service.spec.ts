/* eslint-disable @typescript-eslint/dot-notation */
import { ApolloError } from "@apollo/client/core";
import { ModalService } from "./../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorService } from "./error.service";
import { ErrorTexts } from "../common/errors.text";

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

    it("should show modal window when error occured", () => {
        const mockErrorMessage = "Mock error message";
        const modalServiceSpy: jasmine.Spy = spyOn(
            service["modalService"],
            "error",
        ).and.callThrough();
        service.processError(new Error(mockErrorMessage));
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ message: mockErrorMessage }),
        );
    });

    it("should show modal window when connection was lost", () => {
        const mockErrorMessage = "Mock apollo error message";
        const modalServiceSpy: jasmine.Spy = spyOn(
            service["modalService"],
            "error",
        ).and.callThrough();
        service.processError(
            new ApolloError({
                errorMessage: mockErrorMessage,
                networkError: new Error("Problem with internet"),
            }),
        );
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: ErrorTexts.ERROR_NETWORK_DESCRIPTION,
            }),
        );
    });
});
