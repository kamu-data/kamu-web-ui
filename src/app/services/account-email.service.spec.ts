import { TestBed } from "@angular/core/testing";
import { AccountEmailService } from "./account-email.service";
import { Apollo } from "apollo-angular";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { AccountApi } from "../api/account.api";
import { of } from "rxjs";
import {
    mockAccountChangeEmailMutationError,
    mockAccountChangeEmailMutationSuccess,
    mockAccountWithEmailQuery,
} from "../api/mock/account.mock";
import { TEST_ACCOUNT_EMAIL } from "../api/mock/auth.mock";
import { TEST_ACCOUNT_NAME } from "../api/mock/dataset.mock";

describe("AccountEmailService", () => {
    let service: AccountEmailService;
    let accountApi: AccountApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
        accountApi = TestBed.inject(AccountApi);
        toastrService = TestBed.inject(ToastrService);
        service = TestBed.inject(AccountEmailService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check reset rename account error", () => {
        const emitRenameAccountEmailErrorOccurredSpy = spyOn(service, "emitRenameAccountEmailErrorOccurred");
        service.resetChangeEmailError();
        expect(emitRenameAccountEmailErrorOccurredSpy).toHaveBeenCalledWith("");
    });

    it("should check fetch account with success", () => {
        const fetchAccountWithEmailSpy = spyOn(accountApi, "fetchAccountWithEmail").and.returnValue(
            of(mockAccountWithEmailQuery),
        );
        service.fetchAccountWithEmail(TEST_ACCOUNT_EMAIL).subscribe(() => {
            expect(fetchAccountWithEmailSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check change account email with success", () => {
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");
        const changeAccountEmailSpy = spyOn(accountApi, "changeAccountEmail").and.returnValue(
            of(mockAccountChangeEmailMutationSuccess),
        );
        service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }).subscribe(() => {
            expect(changeAccountEmailSpy).toHaveBeenCalledTimes(1);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith(
                mockAccountChangeEmailMutationSuccess.accounts.byName?.updateEmail.message,
            );
        });
    });

    it("should check change account email with error", () => {
        const emitRenameAccountEmailErrorOccurredSpy = spyOn(service, "emitRenameAccountEmailErrorOccurred");
        const changeAccountEmailSpy = spyOn(accountApi, "changeAccountEmail").and.returnValue(
            of(mockAccountChangeEmailMutationError),
        );
        service.changeEmailAddress({ accountName: TEST_ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL }).subscribe(() => {
            expect(changeAccountEmailSpy).toHaveBeenCalledTimes(1);
            expect(emitRenameAccountEmailErrorOccurredSpy).toHaveBeenCalledWith(
                mockAccountChangeEmailMutationError.accounts.byName?.updateEmail.message as string,
            );
        });
    });
});
