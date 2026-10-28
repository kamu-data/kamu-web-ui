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

import { AccountService } from "src/app/account/account.service";
import { AdminChangePasswordComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.component";
import { AdminChangePasswordHarness } from "src/app/account/settings/tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.harness";
import { AppConfigService } from "src/app/app-config.service";

describe("AdminChangePasswordComponent", () => {
    let fixture: ComponentFixture<AdminChangePasswordComponent>;
    let accountService: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AdminChangePasswordComponent],
        });
        accountService = TestBed.inject(AccountService);
    });

    function createHarness(configuredMinLength: number): Promise<AdminChangePasswordHarness> {
        vi.spyOn(TestBed.inject(AppConfigService), "minNewPasswordLength", "get").mockReturnValue(configuredMinLength);
        fixture = TestBed.createComponent(AdminChangePasswordComponent);
        setComponentInput(fixture, "accountName", "accountName");
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, AdminChangePasswordHarness);
    }

    it("should require a new password and its confirmation", async () => {
        const form = await createHarness(8);

        await form.setNewPassword("");
        await form.setConfirmPassword("");

        expect(await form.getNewPasswordError()).toBe("New password is required");
        expect(await form.getConfirmPasswordError()).toBe("Confirm password is required");
        expect(await form.isUpdateDisabled()).toBe(true);
    });

    [
        { configuredMinLength: 4, password: "1234567", minLength: 8 },
        { configuredMinLength: 4, password: "   1234567   ", minLength: 8 },
        { configuredMinLength: 12, password: "12345678901", minLength: 12 },
    ].forEach(({ configuredMinLength, password, minLength }) => {
        it(`should ask for ${minLength} characters, not counting spaces around, when ${configuredMinLength} are configured`, async () => {
            const form = await createHarness(configuredMinLength);

            await form.setNewPassword(password);

            expect(await form.getNewPasswordError()).toBe(`New password must be at least ${minLength} characters`);
        });
    });

    it("should reject a password with characters other than ASCII", async () => {
        const form = await createHarness(8);

        await form.setNewPassword("pässwörd123");

        expect(await form.getNewPasswordError()).toBe("New password may only contain ASCII characters");
    });

    it("should show a mismatch under the confirmation", async () => {
        const form = await createHarness(8);

        await form.setNewPassword("password1");
        await form.setConfirmPassword("password2");

        expect(await form.getNewPasswordError()).toBeNull();
        expect(await form.getConfirmPasswordError()).toBe("Passwords mismatch");
        expect(await form.isUpdateDisabled()).toBe(true);
    });

    it("should show a mismatch once the new password changes after the confirmation", async () => {
        const form = await createHarness(8);
        await form.setNewPassword("password1");
        await form.setConfirmPassword("password1");
        expect(await form.getConfirmPasswordError()).toBeNull();

        await form.setNewPassword("password2");

        expect(await form.getConfirmPasswordError()).toBe("Passwords mismatch");
    });

    it("should show the confirmation's own length error before the mismatch", async () => {
        const form = await createHarness(8);

        await form.setNewPassword("password1");
        await form.setConfirmPassword("short");

        expect(await form.getConfirmPasswordError()).toBe("Confirm password must be at least 8 characters");
    });

    it("should not update the password while the form is invalid", async () => {
        const changeAdminPasswordSpy = vi.spyOn(accountService, "changeAdminPassword");
        const form = await createHarness(8);

        await form.setNewPassword("password1");
        await form.setConfirmPassword("password2");
        await form.update();

        expect(changeAdminPasswordSpy).not.toHaveBeenCalled();
    });

    it("should update the password and clear the form", async () => {
        const changeAdminPasswordSpy = vi.spyOn(accountService, "changeAdminPassword").mockReturnValue(of(true));
        const form = await createHarness(8);

        await form.setNewPassword("password1");
        await form.setConfirmPassword("password1");
        expect(await form.isUpdateDisabled()).toBe(false);
        await form.update();

        expect(changeAdminPasswordSpy).toHaveBeenCalledWith({ accountName: "accountName", password: "password1" });
        expect(fixture.componentInstance.changeAdminAccountPasswordForm.getRawValue()).toEqual({
            newPassword: "",
            confirmPassword: "",
        });
    });
});
