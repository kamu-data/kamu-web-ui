/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails, TEST_LOGIN } from "@api/mock/auth.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AccountService } from "src/app/account/account.service";
import { AccountTabComponent } from "src/app/account/settings/tabs/account-tab/account-tab.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("AccountTabComponent", () => {
    let component: AccountTabComponent;
    let fixture: ComponentFixture<AccountTabComponent>;
    let modalService: ModalService;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, AccountTabComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(AccountTabComponent);
        modalService = TestBed.inject(ModalService);
        accountService = TestBed.inject(AccountService);
        loggedUserService = TestBed.inject(LoggedUserService);
        navigationService = TestBed.inject(NavigationService);
        vi.spyOn(accountService, "deleteAccountByName").mockReturnValue(of(true));
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check delete account name when the URL does not contain the account name", () => {
        vi.spyOn(component, "accountName", "get").mockReturnValue(undefined);
        vi.spyOn(component, "isOwnerPage", "get").mockReturnValue(true);
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const logoutSpy = vi.spyOn(loggedUserService, "logout").mockImplementation(() => {});
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });

        component.deleteAccount();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(logoutSpy).toHaveBeenCalledTimes(1);
        expect(logoutSpy).toHaveBeenCalledWith();
    });

    it("should check delete account name when the URL contain the account name", () => {
        vi.spyOn(component, "accountName", "get").mockReturnValue(TEST_LOGIN);
        vi.spyOn(component, "isOwnerPage", "get").mockReturnValue(false);
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToHomeSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });

        component.deleteAccount();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });

    it("should check rename account username when the URL does not contain the account name", () => {
        vi.spyOn(component, "accountName", "get").mockReturnValue(undefined);
        vi.spyOn(component, "isOwnerPage", "get").mockReturnValue(true);
        vi.spyOn(accountService, "changeAccountUsername").mockReturnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });

        component.changeUsername();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(0);
    });

    it("should check rename account username when the URL contain the account name", () => {
        vi.spyOn(component, "accountName", "get").mockReturnValue(TEST_LOGIN);
        vi.spyOn(component, "isOwnerPage", "get").mockReturnValue(false);
        vi.spyOn(accountService, "changeAccountUsername").mockReturnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });

        component.changeUsername();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
    });
});
