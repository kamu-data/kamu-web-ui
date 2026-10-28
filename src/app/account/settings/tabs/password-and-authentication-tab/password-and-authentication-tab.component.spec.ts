/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { AccountService } from "src/app/account/account.service";
import { PasswordAndAuthenticationTabComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component";
import { PasswordAndAuthenticationTabHarness } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.harness";
import { AppConfigService } from "src/app/app-config.service";

describe("PasswordAndAuthenticationTabComponent", () => {
    let component: PasswordAndAuthenticationTabComponent;
    let fixture: ComponentFixture<PasswordAndAuthenticationTabComponent>;
    let accountService: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [PasswordAndAuthenticationTabComponent],
        });
        accountService = TestBed.inject(AccountService);
        vi.spyOn(TestBed.inject(AppConfigService), "minNewPasswordLength", "get").mockReturnValue(4);
        fixture = TestBed.createComponent(PasswordAndAuthenticationTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "account", mockAccountDetails);
        fixture.detectChanges();
    });

    async function openChangePassword(): Promise<PasswordAndAuthenticationTabHarness> {
        const tab = await TestbedHarnessEnvironment.harnessForFixture(fixture, PasswordAndAuthenticationTabHarness);
        await tab.toggleChangePassword();
        return tab;
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the admin form to an admin", async () => {
        setComponentInput(fixture, "account", { ...mockAccountDetails, isAdmin: true });
        const tab = await openChangePassword();

        expect(await tab.getAdminChangePassword()).not.toBeNull();
    });

    it("should not show the admin form when the account does not say it is an admin", async () => {
        setComponentInput(fixture, "account", { ...mockAccountDetails, isAdmin: null });
        const tab = await openChangePassword();

        expect(await tab.getAdminChangePassword()).toBeNull();
    });

    it("should require every field", async () => {
        const tab = await openChangePassword();

        await tab.setOldPassword("");
        await tab.setNewPassword("");
        await tab.setConfirmPassword("");

        expect(await tab.getAdminChangePassword()).toBeNull();
        expect(await tab.getOldPasswordError()).toBe("Old password is required");
        expect(await tab.getNewPasswordError()).toBe("New password is required");
        expect(await tab.getConfirmPasswordError()).toBe("Confirm password is required");
        expect(await tab.isUpdateDisabled()).toBe(true);
    });

    ["1234567", "  1234567  "].forEach((password) => {
        it(`should ask for at least 8 characters in "${password}", the server's minimum`, async () => {
            const tab = await openChangePassword();

            await tab.setNewPassword(password);
            await tab.setConfirmPassword(password);

            expect(await tab.getNewPasswordError()).toBe("New password must be at least 8 characters");
            expect(await tab.getConfirmPasswordError()).toBe("Confirm password must be at least 8 characters");
        });
    });

    ["12345678", "  12345678 "].forEach((password) => {
        it(`should accept "${password}", which has the server's minimum of 8 characters`, async () => {
            const tab = await openChangePassword();

            await tab.setOldPassword("old-password");
            await tab.setNewPassword(password);
            await tab.setConfirmPassword(password);

            expect(await tab.getNewPasswordError()).toBeNull();
            expect(await tab.getConfirmPasswordError()).toBeNull();
            expect(await tab.isUpdateDisabled()).toBe(false);
        });
    });

    describe("with 12 characters configured", () => {
        beforeEach(() => {
            fixture.destroy();
            vi.spyOn(TestBed.inject(AppConfigService), "minNewPasswordLength", "get").mockReturnValue(12);
            fixture = TestBed.createComponent(PasswordAndAuthenticationTabComponent);
            component = fixture.componentInstance;
            setComponentInput(fixture, "account", mockAccountDetails);
            fixture.detectChanges();
        });

        it("should ask for 12 characters", async () => {
            const tab = await openChangePassword();

            await tab.setNewPassword("12345678901");

            expect(await tab.getNewPasswordError()).toBe("New password must be at least 12 characters");
        });

        it("should accept 12 characters", async () => {
            const tab = await openChangePassword();

            await tab.setOldPassword("old-password");
            await tab.setNewPassword("123456789012");
            await tab.setConfirmPassword("123456789012");

            expect(await tab.getNewPasswordError()).toBeNull();
            expect(await tab.isUpdateDisabled()).toBe(false);
        });
    });

    it("should reject a password with characters other than ASCII", async () => {
        const tab = await openChangePassword();

        await tab.setNewPassword("пароль-12345");

        expect(await tab.getNewPasswordError()).toBe("New password may only contain ASCII characters");
    });

    it("should show a mismatch under the confirmation", async () => {
        const tab = await openChangePassword();

        await tab.setNewPassword("password1");
        await tab.setConfirmPassword("password2");

        expect(await tab.getConfirmPasswordError()).toBe("Passwords mismatch");
    });

    it("should not update the password while the form is invalid", async () => {
        const changeUserPasswordSpy = vi.spyOn(accountService, "changeUserPassword");
        const tab = await openChangePassword();

        await tab.setOldPassword("old-password");
        await tab.setNewPassword("password1");
        await tab.setConfirmPassword("password2");
        expect(await tab.isUpdateDisabled()).toBe(true);
        await tab.update();

        expect(changeUserPasswordSpy).not.toHaveBeenCalled();
    });

    it("should update the password and clear the form", async () => {
        const changeUserPasswordSpy = vi.spyOn(accountService, "changeUserPassword").mockReturnValue(of(true));
        const tab = await openChangePassword();

        await tab.setOldPassword("old-password");
        await tab.setNewPassword("password1");
        await tab.setConfirmPassword("password1");
        expect(await tab.isUpdateDisabled()).toBe(false);
        await tab.update();

        expect(changeUserPasswordSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            oldPassword: "old-password",
            newPassword: "password1",
        });
        expect(component.changeUserAccountPasswordForm.getRawValue()).toEqual({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    });

    it("should keep what the user typed when the server does not change the password", async () => {
        vi.spyOn(accountService, "changeUserPassword").mockReturnValue(of(false));
        const tab = await openChangePassword();

        await tab.setOldPassword("old-password");
        await tab.setNewPassword("password1");
        await tab.setConfirmPassword("password1");
        await tab.update();

        expect(component.changeUserAccountPasswordForm.getRawValue()).toEqual({
            oldPassword: "old-password",
            newPassword: "password1",
            confirmPassword: "password1",
        });
    });
});
