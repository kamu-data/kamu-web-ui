/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import {
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails, mockAccountDetailsWithEmail } from "@api/mock/auth.mock";

import { AccountSettingsComponent } from "src/app/account/settings/account-settings.component";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginService } from "src/app/auth/login/login.service";

describe("AccountSettingsComponent", () => {
    let component: AccountSettingsComponent;
    let fixture: ComponentFixture<AccountSettingsComponent>;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let accountEmailService: AccountEmailService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, ApolloTestingModule, AccountSettingsComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        accountEmailService = TestBed.inject(AccountEmailService);

        loginService = TestBed.inject(LoginService);
        spyOn(accountEmailService, "fetchAccountWithEmail").and.returnValue(of(mockAccountDetailsWithEmail));
        spyOnProperty(loginService, "accountChanges", "get").and.returnValue(of(mockAccountDetails));
        loggedUserService = TestBed.inject(LoggedUserService);

        fixture = TestBed.createComponent(AccountSettingsComponent);
        component = fixture.componentInstance;
    });

    enum Elements {
        UserNameLink = "user-name-link",
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should see logged user", () => {
        fixture.detectChanges();
        const userNameLinKElement: HTMLElement = getElementByDataTestId(fixture, Elements.UserNameLink);
        expect(userNameLinKElement.innerText).toEqual(
            `${mockAccountDetails.displayName} (${mockAccountDetails.accountName})`,
        );
    });

    it("should not show user data for logged off case", () => {
        loggedUserService.terminateSession();
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, Elements.UserNameLink)).toBeFalsy();
    });
});
