import { ErrorTexts } from "../common/errors.text";
import { ApolloError } from "@apollo/client/core";
import { DatasetNotFoundError, InvalidSqlError } from "../common/errors";
import { ModalService } from "../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";
import { ErrorHandlerService } from "./error-handler.service";
import { NavigationService } from "./navigation.service";

describe("ErrorHandlerService", () => {
    let service: ErrorHandlerService;
    let modalService: ModalService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService, NavigationService],
        });
        service = TestBed.inject(ErrorHandlerService);
        modalService = TestBed.inject(ModalService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should show modal window when error sql query incorrect", () => {
        const modalServiceSpy: jasmine.Spy = spyOn(
            modalService,
            "error",
        ).and.callThrough();
        service.handleError(new InvalidSqlError());
        expect(modalServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: ErrorTexts.ERROR_BAD_SQL_QUERY,
            }),
        );
    });

    it("should show redirect to 404 page on dataset not found", async () => {
        const modalServiceSpy: jasmine.Spy = spyOn(
            modalService,
            "error",
        ).and.stub();
        const navigationServiceSpy: jasmine.Spy = spyOn(
            navigationService,
            "navigateToPageNotFound",
        ).and.stub();
        navigationService.navigateToPageNotFound();
        service.handleError(new DatasetNotFoundError());
        await expect(modalServiceSpy).not.toHaveBeenCalled();
        await expect(navigationServiceSpy).toHaveBeenCalled();
    });

    it("should show modal window when connection was lost", async () => {
        const mockErrorMessage = "Mock apollo error message";
        const modalServiceSpy: jasmine.Spy = spyOn(
            modalService,
            "error",
        ).and.callThrough();
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
        await expect(modalServiceSpy).toHaveBeenCalledTimes(2);
    });

    it("should log unknown errors", async () => {
        const modalServiceSpy: jasmine.Spy = spyOn(
            modalService,
            "error",
        ).and.callThrough();
        const consoleErrorSpy: jasmine.Spy = spyOn(console, "error").and.stub();
        service.handleError(new Error("Some Unknown Error"));
        await expect(modalServiceSpy).not.toHaveBeenCalled();
        await expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
