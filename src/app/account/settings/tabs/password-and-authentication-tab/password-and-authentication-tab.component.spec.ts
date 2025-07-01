/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PasswordAndAuthenticationTabComponent } from "./password-and-authentication-tab.component";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { MatDividerModule } from "@angular/material/divider";
import { AdminChangePasswordComponent } from "./components/admin-change-password/admin-change-password.component";
import { AccountService } from "src/app/account/account.service";
import { of } from "rxjs";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("PasswordAndAuthenticationTabComponent", () => {
    let component: PasswordAndAuthenticationTabComponent;
    let fixture: ComponentFixture<PasswordAndAuthenticationTabComponent>;
    let accountService: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [
                HttpClientTestingModule,
                MatDividerModule,
                PasswordAndAuthenticationTabComponent,
                AdminChangePasswordComponent,
            ],
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
