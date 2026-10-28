/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, provideRouter, Router } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { isMobileView } from "@common/helpers/app.helpers";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { FetchAccountDetailsGQL } from "@api/kamu.graphql.interface";
import { mockAccountFromAccessToken } from "@api/mock/auth.mock";

import { ALL_URLS_WITHOUT_HEADER, AppComponent } from "src/app/app.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginService } from "src/app/auth/login/login.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import { mockAutocompleteItems } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-empty-route",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class EmptyRouteComponent {}

describe("AppComponent", () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let fetchAccountDetailsGQL: FetchAccountDetailsGQL;
    const DEFAULT_SEARCH_QUERY = "defaultSearchQuery";

    const apolloMock = {
        client: {
            cache: {
                restore: vi.fn().mockName("cache.restore"),
            },
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                {
                    provide: Apollo,
                    useValue: apolloMock,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ query: DEFAULT_SEARCH_QUERY }),
                    },
                },
                provideRouter([{ path: "**", component: EmptyRouteComponent }]),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AppComponent);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        loginService = TestBed.inject(LoginService);
        fetchAccountDetailsGQL = TestBed.inject(FetchAccountDetailsGQL);

        component = fixture.componentInstance;
        // Silences the version banner ngOnInit prints to the console
        vi.spyOn(console, "info").mockImplementation(() => {});
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should check call checkWindowSize method", () => {
        const checkWindowSizeSpy = vi.spyOn(component, "checkWindowSize");
        window.dispatchEvent(new Event("resize"));
        expect(checkWindowSizeSpy).toHaveBeenCalledWith();
        expect(component.isMobileView).toEqual(isMobileView());
    });

    it("should check call onLogout method", () => {
        const logoutSpy = vi.spyOn(loggedUserService, "logout").mockReturnValue();
        component.onLogout();
        expect(logoutSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogin method", () => {
        const loginSpy = vi.spyOn(navigationService, "navigateToLogin").mockReturnValue();
        component.onLogin();
        expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it("should check call onSelectDataset method and navigate to dataset", () => {
        const navigateToDatasetViewSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockReturnValue();
        component.onSelectedDataset(mockAutocompleteItems[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAutocompleteItems[0].dataset.owner.accountName,
            datasetName: mockAutocompleteItems[0].dataset.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should check call onSelectDataset method and navigate to search", () => {
        const navigateToSearchSpy = vi.spyOn(navigationService, "navigateToSearch").mockReturnValue();
        component.onSelectedDataset(mockAutocompleteItems[1]);
        expect(navigateToSearchSpy).toHaveBeenCalledWith(mockAutocompleteItems[1].dataset.id);
    });

    ProjectLinks.ALL_URLS.filter((url) => !ALL_URLS_WITHOUT_HEADER.includes(url)).forEach((url: string) => {
        it(`should show header when going to ${url} page`, async () => {
            await TestBed.inject(Router).navigateByUrl(url);
            expect(component.isHeaderVisible).toBe(true);
        });
    });

    ALL_URLS_WITHOUT_HEADER.forEach((url: string) => {
        it(`should hide header when going to ${url} page`, async () => {
            await TestBed.inject(Router).navigateByUrl(`/${url}`);
            expect(component.isHeaderVisible).toBe(false);
        });
    });

    ["/dev/login-records", "/kamu/notes?query=v/login", "/kamu/github_callback-mirror"].forEach((url: string) => {
        it(`should show header for ${url}, which only contains the path of a page without it`, async () => {
            await TestBed.inject(Router).navigateByUrl(url);

            expect(component.isHeaderVisible).toBe(true);
        });
    });

    it("should react on login/logout changes", () => {
        vi.spyOn(fetchAccountDetailsGQL, "mutate").mockReturnValue(
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
