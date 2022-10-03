import { ErrorTexts } from "../common/errors.text";
import { ApolloError } from "@apollo/client/core";
import { CustomApolloError, InvalidSqlError } from "../common/errors";
import { ModalService } from "../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorHandlerService } from "./error-handler.service";

describe("ErrorHandlerService", () => {
    let service: ErrorHandlerService;
    let modalService: ModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService],
        });
        service = TestBed.inject(ErrorHandlerService);
        modalService = TestBed.inject(ModalService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should show modal window when error sql query incorrect", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        service.handleError(new InvalidSqlError());
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: ErrorTexts.ERROR_BAD_SQL_QUERY,
            }),
        );
    });

    it("should show modal window when connection was lost", async () => {
        const mockErrorMessage = "Mock apollo error message";
        const modalServiceSpy: jasmine.Spy = spyOn(modalService, "error").and.callThrough();
        service.handleError(
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
