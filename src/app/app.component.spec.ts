/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockAutocompleteItems } from "./search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ALL_URLS_WITHOUT_HEADER, AppComponent } from "./app.component";
import { isMobileView } from "./common/helpers/app.helpers";
import { NavigationService } from "./services/navigation.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import ProjectLinks from "./project-links";
import { registerMatSvgIcons, routerMock, routerMockEventSubject } from "./common/helpers/base-test.helpers.spec";
import { ActivatedRoute, NavigationEnd } from "@angular/router";
import { mockAccountFromAccessToken } from "./api/mock/auth.mock";
import { FetchAccountDetailsGQL } from "./api/kamu.graphql.interface";
import { LoggedUserService } from "./auth/logged-user.service";
import { LoginService } from "./auth/login/login.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DatasetViewTypeEnum } from "./dataset-view/dataset-view.interface";

describe("AppComponent", () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let fetchAccountDetailsGQL: FetchAccountDetailsGQL;
    const DEFAULT_SEARCH_QUERY = "defaultSearchQuery";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, HttpClientTestingModule, AppComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ query: DEFAULT_SEARCH_QUERY }),
                    },
                },
            ],
        }).compileComponents();

        registerMatSvgIcons();

        routerMock.url = ProjectLinks.URL_HOME;

        fixture = TestBed.createComponent(AppComponent);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        loginService = TestBed.inject(LoginService);
        fetchAccountDetailsGQL = TestBed.inject(FetchAccountDetailsGQL);

        component = fixture.componentInstance;
        routerMockEventSubject.next(new NavigationEnd(1, ProjectLinks.URL_LOGIN, ""));
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should check call checkWindowSize method", () => {
        const checkWindowSizeSpy = spyOn(component, "checkWindowSize").and.callThrough();
        window.dispatchEvent(new Event("resize"));
        expect(checkWindowSizeSpy).toHaveBeenCalledWith();
        expect(component.isMobileView).toEqual(isMobileView());
    });

    it("should check call onLogout method", () => {
        const logoutSpy = spyOn(loggedUserService, "logout").and.returnValue();
        component.onLogout();
        expect(logoutSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogin method", () => {
        const loginSpy = spyOn(navigationService, "navigateToLogin").and.returnValue();
        component.onLogin();
        expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it("should check call onSelectDataset method and navigate to dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.returnValue();
        component.onSelectedDataset(mockAutocompleteItems[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAutocompleteItems[0].dataset.owner.accountName,
            datasetName: mockAutocompleteItems[0].dataset.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should check call onSelectDataset method and navigate to search", () => {
        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch").and.returnValue();
        component.onSelectedDataset(mockAutocompleteItems[1]);
        expect(navigateToSearchSpy).toHaveBeenCalledWith(mockAutocompleteItems[1].dataset.id);
    });

    ProjectLinks.ALL_URLS.filter((url) => !ALL_URLS_WITHOUT_HEADER.includes(url)).forEach((url: string) => {
        it(`should show header when going to ${url} page`, () => {
            routerMockEventSubject.next(new NavigationEnd(1, url, ""));
            fixture.detectChanges();
            expect(component.isHeaderVisible).toBeTrue();
        });
    });

    it("should react on login/logout changes", () => {
        spyOn(fetchAccountDetailsGQL, "mutate").and.returnValue(
            of({
                loading: false,
                data: mockAccountFromAccessToken,
            }),
        );
        loginService.fetchAccountFromAccessToken("someToken").subscribe();

        expect(component.loggedAccount).toEqual(mockAccountFromAccessToken.auth.accountDetails);

        loggedUserService.terminateSession();
        expect(component.loggedAccount).toEqual(AppComponent.ANONYMOUS_ACCOUNT_INFO);
    });
});
