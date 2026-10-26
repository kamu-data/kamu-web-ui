/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { BehaviorSubject, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { getElementByDataTestId, registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { mockAccountDetails, TEST_AVATAR_URL, TEST_LOGIN } from "@api/mock/auth.mock";

import { AccountComponent } from "src/app/account/account.component";
import { AccountPageQueryParams } from "src/app/account/account.component.model";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;

    const mockQueryParams: BehaviorSubject<AccountPageQueryParams> = new BehaviorSubject<AccountPageQueryParams>({
        tab: AccountTabs.INBOX,
    });

    const mockParams = new BehaviorSubject({
        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName,
    });

    let fetchAccountByNameSpy: Mock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountComponent],
            providers: [
                Apollo,
                provideHttpClient(),
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: mockQueryParams.asObservable(),
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        accountService = TestBed.inject(AccountService);
        loggedUserService = TestBed.inject(LoggedUserService);
        fetchAccountByNameSpy = vi.spyOn(accountService, "fetchAccountByName").mockReturnValue(of(mockAccountDetails));
        vi.spyOn(loggedUserService, "loggedInUserChanges", "get").mockReturnValue(of(null));
        vi.spyOn(accountService, "getDatasetsTotalCountByAccountName").mockReturnValue(of(1));

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "accountName", TEST_LOGIN);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check avatar link propagation vs default", () => {
        expect(component.avatarLink(mockAccountDetails)).toEqual(TEST_AVATAR_URL);

        expect(
            component.avatarLink({
                ...mockAccountDetails,
                avatarUrl: undefined,
            }),
        ).toEqual(AppValues.DEFAULT_AVATAR_URL);
    });

    it("should check isLoggedUser property", () => {
        expect(component.isLoggedUser(mockAccountDetails)).toEqual(false);

        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName });

        expect(component.isLoggedUser(mockAccountDetails)).toEqual(true);
    });

    it("should show the avatar image without linking to it", () => {
        fixture.detectChanges();
        const avatar = getElementByDataTestId(fixture, "account-avatar", HTMLImageElement);
        expect(avatar.src).toEqual(TEST_AVATAR_URL);
        expect(avatar.closest("a")).toBeNull();
    });

    it("should check API calls when account is found", () => {
        fixture.detectChanges();
        expect(fetchAccountByNameSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountByNameSpy).toHaveBeenCalledWith(mockAccountDetails.accountName);
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
