/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountTabComponent } from "./account-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { MatDividerModule } from "@angular/material/divider";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { AccountService } from "src/app/account/account.service";
import { of } from "rxjs";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { mockAccountDetails, TEST_LOGIN } from "src/app/api/mock/auth.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("AccountTabComponent", () => {
    let component: AccountTabComponent;
    let fixture: ComponentFixture<AccountTabComponent>;
    let modalService: ModalService;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                MatDividerModule,
                AccountTabComponent,
            ],
            providers: [Apollo, provideAnimations(), provideToastr()],
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
