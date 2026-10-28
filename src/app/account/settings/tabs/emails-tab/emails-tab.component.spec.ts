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
import type { Mock } from "vitest";

import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetailsWithEmail } from "@api/mock/auth.mock";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { EmailsTabComponent } from "src/app/account/settings/tabs/emails-tab/emails-tab.component";
import { EmailsTabHarness } from "src/app/account/settings/tabs/emails-tab/emails-tab.harness";
import { NavigationService } from "src/app/services/navigation.service";

describe("EmailsTabComponent", () => {
    let component: EmailsTabComponent;
    let fixture: ComponentFixture<EmailsTabComponent>;
    let accountEmailService: AccountEmailService;
    let navigateToSettingsSpy: Mock<NavigationService["navigateToSettings"]>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [EmailsTabComponent],
        });
        accountEmailService = TestBed.inject(AccountEmailService);
        fixture = TestBed.createComponent(EmailsTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "account", mockAccountDetailsWithEmail);
        navigateToSettingsSpy = stubMethod(TestBed.inject(NavigationService), "navigateToSettings");
        fixture.detectChanges();
    });

    function emailsTabHarness(): Promise<EmailsTabHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, EmailsTabHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the current email in an email input", async () => {
        const tab = await emailsTabHarness();

        expect(await tab.getEmail()).toBe(mockAccountDetailsWithEmail.email);
        expect(await tab.getEmailInputType()).toBe("email");
        expect(await tab.getEmailError()).toBeNull();
    });

    [
        { email: "", message: "Email address is required" },
        { email: "not-an-email", message: "Please provide a valid email address" },
        { email: "user@", message: "Please provide a valid email address" },
    ].forEach(({ email, message }) => {
        it(`should not change the email to "${email}"`, async () => {
            const changeEmailAddressSpy = vi.spyOn(accountEmailService, "changeEmailAddress");
            const tab = await emailsTabHarness();

            await tab.setEmail(email);
            expect(await tab.getEmailError()).toBe(message);
            expect(await tab.isChangeEmailDisabled()).toBe(true);
            await tab.changeEmail();

            expect(changeEmailAddressSpy).not.toHaveBeenCalled();
        });
    });

    it("should change the email, trimmed, and return to the emails tab", async () => {
        const changeEmailAddressSpy = vi
            .spyOn(accountEmailService, "changeEmailAddress")
            .mockReturnValue(of({ ok: true, value: true } as const));
        const tab = await emailsTabHarness();

        await tab.setEmail("  new@example.com ");
        expect(await tab.getEmailError()).toBeNull();
        await tab.changeEmail();

        expect(changeEmailAddressSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetailsWithEmail.accountName,
            newEmail: "new@example.com",
        });
        expect(navigateToSettingsSpy).toHaveBeenCalledWith(AccountSettingsTabs.EMAILS);
    });

    it("should show an email the backend rejects under the field, stay on the form, and clear it once edited", async () => {
        vi.spyOn(accountEmailService, "changeEmailAddress").mockReturnValue(
            of({ ok: false, fieldError: "Email address is already used by another account" } as const),
        );
        const tab = await emailsTabHarness();

        await tab.setEmail("new@example.com");
        await tab.changeEmail();

        expect(await tab.getEmailError()).toBe("Email address is already used by another account");
        expect(await tab.isChangeEmailDisabled()).toBe(true);
        expect(await tab.getEmail()).toBe("new@example.com");
        expect(navigateToSettingsSpy).not.toHaveBeenCalled();

        await tab.setEmail("other@example.com");

        expect(await tab.getEmailError()).toBeNull();
        expect(await tab.isChangeEmailDisabled()).toBe(false);
    });
});
