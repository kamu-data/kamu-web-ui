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
import { AccountService } from "src/app/account/account.service";
import { AccountTabComponent } from "src/app/account/settings/tabs/account-tab/account-tab.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

import { ModalService } from "@common/components/modal/modal.service";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails, TEST_LOGIN } from "@api/mock/auth.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

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
        spyOn(accountService, "deleteAccountByName").and.returnValue(of(true));
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check delete account name when the URL does not contain the account name", () => {
        spyOnProperty(component, "accountName", "get").and.returnValue(undefined);
        spyOnProperty(component, "isOwnerPage", "get").and.returnValue(true);
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const logoutSpy = spyOn(loggedUserService, "logout");
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });

        component.deleteAccount();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(logoutSpy).toHaveBeenCalledOnceWith();
    });

    it("should check delete account name when the URL contain the account name", () => {
        spyOnProperty(component, "accountName", "get").and.returnValue(TEST_LOGIN);
        spyOnProperty(component, "isOwnerPage", "get").and.returnValue(false);
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });

        component.deleteAccount();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy).toHaveBeenCalledOnceWith();
    });

    it("should check rename account username when the URL does not contain the account name", () => {
        spyOnProperty(component, "accountName", "get").and.returnValue(undefined);
        spyOnProperty(component, "isOwnerPage", "get").and.returnValue(true);
        spyOn(accountService, "changeAccountUsername").and.returnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });

        component.changeUsername();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(0);
    });

    it("should check rename account username when the URL contain the account name", () => {
        spyOnProperty(component, "accountName", "get").and.returnValue(TEST_LOGIN);
        spyOnProperty(component, "isOwnerPage", "get").and.returnValue(false);
        spyOn(accountService, "changeAccountUsername").and.returnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });

        component.changeUsername();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
    });
});
