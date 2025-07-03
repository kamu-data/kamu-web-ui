/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminChangePasswordComponent } from "./admin-change-password.component";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { of } from "rxjs";

describe("AdminChangePasswordComponent", () => {
    let component: AdminChangePasswordComponent;
    let fixture: ComponentFixture<AdminChangePasswordComponent>;
    let accountService: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AdminChangePasswordComponent],
        });
        fixture = TestBed.createComponent(AdminChangePasswordComponent);
        accountService = TestBed.inject(AccountService);
        component = fixture.componentInstance;
        component.accountName = "accountName";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to update password", () => {
        const changeAdminPasswordSpy = spyOn(accountService, "changeAdminPassword").and.returnValue(of(true));
        const resetSpy = spyOn(component.changeAdminAccountPasswordForm, "reset");
        component.updateAdminPassword();
        expect(changeAdminPasswordSpy).toHaveBeenCalledTimes(1);
        expect(resetSpy).toHaveBeenCalledTimes(1);
    });
});
