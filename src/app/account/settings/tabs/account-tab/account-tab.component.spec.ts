/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails, TEST_LOGIN } from "@api/mock/auth.mock";
import { MaybeUndefined } from "@interface/app.types";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { AccountTabComponent } from "src/app/account/settings/tabs/account-tab/account-tab.component";
import { AccountTabHarness } from "src/app/account/settings/tabs/account-tab/account-tab.harness";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

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
        vi.spyOn(accountService, "deleteAccountByName").mockReturnValue(of(true));
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    [
        { url: "/v/settings/account", expected: true },
        { url: "/kamu/~select/settings", expected: false },
        { url: "/kamu/notes?redirectUrl=/v/settings", expected: false },
    ].forEach(({ url, expected }) => {
        it(`should ${expected ? "" : "not "}treat ${url} as the user's own settings`, () => {
            vi.spyOn(TestBed.inject(Router), "url", "get").mockReturnValue(url);

            expect(component.isOwnerPage).toBe(expected);
        });
    });

    /** Makes the tab act as if opened for this account from the route, or for the user's own account. */
    function openPage(accountName: MaybeUndefined<string>, isOwnerPage: boolean): void {
        vi.spyOn(component, "accountName", "get").mockReturnValue(accountName);
        vi.spyOn(component, "isOwnerPage", "get").mockReturnValue(isOwnerPage);
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    }

    function accountTabHarness(): Promise<AccountTabHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, AccountTabHarness);
    }

    function confirmEveryModal(): Mock<ModalService["error"]> {
        return vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
    }

    it("should show the change password form to an admin on another account's page", async () => {
        openPage(TEST_LOGIN, false);
        const tab = await accountTabHarness();

        expect(await tab.getAdminChangePassword()).not.toBeNull();
    });

    it("should not show the change password form on the user's own page", async () => {
        openPage(undefined, true);
        const tab = await accountTabHarness();

        expect(await tab.getAdminChangePassword()).toBeNull();
    });

    it("should show the current username", async () => {
        const tab = await accountTabHarness();

        expect(await tab.getUsername()).toBe(mockAccountDetails.accountName);
        expect(await tab.getUsernameError()).toBeNull();
    });

    [
        { username: "", message: "Username is required" },
        ...["a-", "a--b", "a_b", "-a", "user name"].map((username) => ({
            username,
            message: "Username may only contain letters, digits, single hyphens and dots between them",
        })),
        { username: "a".repeat(101), message: "Username can't exceed 100 characters" },
    ].forEach(({ username, message }) => {
        it(`should not change the username to "${username}"`, async () => {
            const modalWindowSpy = vi.spyOn(modalService, "error");
            const tab = await accountTabHarness();

            await tab.setUsername(username);
            expect(await tab.getUsernameError()).toBe(message);
            expect(await tab.isChangeUsernameDisabled()).toBe(true);
            await tab.changeUsername();

            expect(modalWindowSpy).not.toHaveBeenCalled();
        });
    });

    ["new-account-username", "my.user-1", "a".repeat(100)].forEach((username) => {
        it(`should change the username to "${username}"`, async () => {
            openPage(undefined, true);
            const changeAccountUsernameSpy = vi
                .spyOn(accountService, "changeAccountUsername")
                .mockReturnValue(of({ changed: false, name: username }));
            confirmEveryModal();
            const tab = await accountTabHarness();

            await tab.setUsername(username);
            expect(await tab.getUsernameError()).toBeNull();
            await tab.changeUsername();

            expect(changeAccountUsernameSpy).toHaveBeenCalledWith({
                accountName: mockAccountDetails.accountName,
                newName: username,
            });
        });
    });

    it("should check delete account name when the URL does not contain the account name", async () => {
        openPage(undefined, true);
        const logoutSpy = stubMethod(loggedUserService, "logout");
        const modalWindowSpy = confirmEveryModal();
        const tab = await accountTabHarness();

        await tab.deleteAccount();

        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(logoutSpy).toHaveBeenCalledTimes(1);
        expect(logoutSpy).toHaveBeenCalledWith();
    });

    it("should check delete account name when the URL contain the account name", async () => {
        openPage(TEST_LOGIN, false);
        const navigateToHomeSpy = stubMethod(navigationService, "navigateToHome");
        const modalWindowSpy = confirmEveryModal();
        const tab = await accountTabHarness();

        await tab.deleteAccount();

        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });

    it("should check rename account username when the URL does not contain the account name", async () => {
        openPage(undefined, true);
        vi.spyOn(accountService, "changeAccountUsername").mockReturnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        const changeUserSpy = stubMethod(loggedUserService, "changeUser");
        const navigateToOwnerViewSpy = stubMethod(navigationService, "navigateToOwnerView");
        const modalWindowSpy = confirmEveryModal();
        const tab = await accountTabHarness();

        await tab.setUsername("new-account-username");
        await tab.changeUsername();

        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(changeUserSpy).toHaveBeenCalledWith({ ...mockAccountDetails, accountName: "new-account-username" });
        expect(navigateToOwnerViewSpy).not.toHaveBeenCalled();
    });

    it("should check rename account username when the URL contain the account name", async () => {
        openPage(TEST_LOGIN, false);
        vi.spyOn(accountService, "changeAccountUsername").mockReturnValue(
            of({ changed: true, name: "new-account-username" }),
        );
        const navigateToOwnerViewSpy = stubMethod(navigationService, "navigateToOwnerView");
        const modalWindowSpy = confirmEveryModal();
        const tab = await accountTabHarness();

        await tab.setUsername("new-account-username");
        await tab.changeUsername();

        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith("new-account-username", AccountTabs.SETTINGS);
    });
});
