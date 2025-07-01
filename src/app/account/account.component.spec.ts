/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountTabs } from "./account.constants";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountComponent } from "./account.component";
import { BehaviorSubject, of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { AccountService } from "src/app/account/account.service";
import ProjectLinks from "src/app/project-links";
import { AccountPageQueryParams } from "./account.component.model";
import { DatasetsTabComponent } from "./additional-components/datasets-tab/datasets-tab.component";
import AppValues from "src/app/common/values/app.values";
import { DatasetListItemComponent } from "src/app/common/components/dataset-list-component/dataset-list-item/dataset-list-item.component";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { NgbPaginationModule, NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { AccountFlowsTabComponent } from "./additional-components/account-flows-tab/account-flows-tab.component";
import { LoggedUserService } from "../auth/logged-user.service";
import { mockAccountDetails, TEST_AVATAR_URL, TEST_LOGIN } from "../api/mock/auth.mock";
import { findElementByDataTestId } from "../common/helpers/base-test.helpers.spec";
import { provideAnimations } from "@angular/platform-browser/animations";

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

    let fetchAccountByNameSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                MatIconModule,
                MatButtonToggleModule,
                MatChipsModule,
                MatDividerModule,
                NgbPaginationModule,
                NgbPopoverModule,
                NgbRatingModule,
                HttpClientTestingModule,
                RouterModule,
                AccountComponent,
                DatasetsTabComponent,
                DatasetListItemComponent,
                PaginationComponent,
                DisplayTimeComponent,
                AccountFlowsTabComponent,
            ],
            providers: [
                DatasetApi,
                provideAnimations(),
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: mockQueryParams.asObservable(),
                    },
                },
            ],
        }).compileComponents();

        accountService = TestBed.inject(AccountService);
        loggedUserService = TestBed.inject(LoggedUserService);
        fetchAccountByNameSpy = spyOn(accountService, "fetchAccountByName").and.returnValue(of(mockAccountDetails));
        spyOnProperty(loggedUserService, "loggedInUserChanges", "get").and.returnValue(of(null));

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        component.accountName = TEST_LOGIN;
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

        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName });

        expect(component.isLoggedUser(mockAccountDetails)).toEqual(true);
    });

    it("should check API calls when account is found", () => {
        fixture.detectChanges();
        expect(fetchAccountByNameSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
    });

    it("should check activeTab when URL not exist query param tab", () => {
        fixture.detectChanges();
        mockQueryParams.next({ page: 1 });
        component.activeTab = AccountTabs.DATASETS;

        expect(component.activeTab).toEqual(AccountTabs.DATASETS);
    });

    it("should check routers link ", () => {
        spyOn(component, "showFlows").and.returnValue(true);
        fixture.detectChanges();
        const datasetsTabLink = findElementByDataTestId(fixture, "link-account-datasets-tab") as HTMLLinkElement;
        expect(datasetsTabLink.href).toContain(`/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`);

        const flowsTabLink = findElementByDataTestId(fixture, "link-account-flows-tab") as HTMLLinkElement;
        expect(flowsTabLink.href).toContain(`/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}`);
    });
});
