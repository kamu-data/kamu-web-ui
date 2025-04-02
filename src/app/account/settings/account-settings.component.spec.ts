/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockAccountDetails, mockAccountDetailsWithEmail } from "../../api/mock/auth.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountSettingsComponent } from "./account-settings.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "../../auth/logged-user.service";
import {
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { of } from "rxjs";
import { LoginService } from "../../auth/login/login.service";
import { MatIconModule } from "@angular/material/icon";
import { ToastrModule } from "ngx-toastr";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { AccountSettingsModule } from "./account-settings.module";

describe("AccountSettingsComponent", () => {
    let component: AccountSettingsComponent;
    let fixture: ComponentFixture<AccountSettingsComponent>;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let accountEmailService: AccountEmailService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountSettingsComponent],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
                AccountSettingsModule,
            ],
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
