/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { getElementByDataTestId, registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { mockAccountDetails, TEST_AVATAR_URL, TEST_LOGIN } from "@api/mock/auth.mock";

import { AccountComponent } from "src/app/account/account.component";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountComponent],
            providers: [Apollo, provideRouter([]), provideHttpClient(), provideToastr(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        accountService = TestBed.inject(AccountService);
        loggedUserService = TestBed.inject(LoggedUserService);
        vi.spyOn(loggedUserService, "loggedInUserChanges", "get").mockReturnValue(of(null));
        vi.spyOn(accountService, "getDatasetsTotalCountByAccountName").mockReturnValue(of(1));

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "accountName", TEST_LOGIN);
        setComponentInput(fixture, "account", mockAccountDetails);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check avatar link propagation vs default", () => {
        expect(component.avatarLink()).toEqual(TEST_AVATAR_URL);

        setComponentInput(fixture, "account", { ...mockAccountDetails, avatarUrl: undefined });
        expect(component.avatarLink()).toEqual(AppValues.DEFAULT_AVATAR_URL);
    });

    it("should check isLoggedUser property", () => {
        expect(component.isLoggedUser()).toEqual(false);

        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);

        expect(component.isLoggedUser()).toEqual(true);
    });

    it("should show the avatar image without linking to it", () => {
        fixture.detectChanges();
        const avatar = getElementByDataTestId(fixture, "account-avatar", HTMLImageElement);
        expect(avatar.src).toEqual(TEST_AVATAR_URL);
        expect(avatar.closest("a")).toBeNull();
    });

    it("should highlight the tab the route resolved as active", () => {
        setComponentInput(fixture, "activeTab", AccountTabs.DATASETS);
        fixture.detectChanges();
        const datasetsTab = getElementByDataTestId(fixture, "account-datasets-tab");
        expect(datasetsTab.classList).toContain("active-link");

        setComponentInput(fixture, "activeTab", AccountTabs.STARS);
        fixture.detectChanges();
        expect(datasetsTab.classList).not.toContain("active-link");
    });

    it("should check routers link ", () => {
        vi.spyOn(component, "showFlows").mockReturnValue(true);
        fixture.detectChanges();
        const datasetsTabLink = getElementByDataTestId(fixture, "link-account-datasets-tab", HTMLAnchorElement);
        expect(datasetsTabLink.href).toContain(`/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`);

        const flowsTabLink = getElementByDataTestId(fixture, "link-account-flows-tab", HTMLAnchorElement);
        expect(flowsTabLink.href).toContain(`/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}`);
    });
});
