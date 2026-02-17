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

import { mockAccountDetails } from "@api/mock/auth.mock";

import { AccountService } from "src/app/account/account.service";
import { PasswordAndAuthenticationTabComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component";

describe("PasswordAndAuthenticationTabComponent", () => {
    let component: PasswordAndAuthenticationTabComponent;
    let fixture: ComponentFixture<PasswordAndAuthenticationTabComponent>;
    let accountService: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [PasswordAndAuthenticationTabComponent],
        });
        fixture = TestBed.createComponent(PasswordAndAuthenticationTabComponent);
        accountService = TestBed.inject(AccountService);
        component = fixture.componentInstance;
        component.account = mockAccountDetails;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to update password", () => {
        const changeUserPasswordSpy = spyOn(accountService, "changeUserPassword").and.returnValue(of(true));
        const resetSpy = spyOn(component.changeUserAccountPasswordForm, "reset");
        component.updateUserPassword();
        expect(changeUserPasswordSpy).toHaveBeenCalledTimes(1);
        expect(resetSpy).toHaveBeenCalledTimes(1);
    });
});
