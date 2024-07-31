import { ModalComponent } from "./components/modal/modal.component";
import { FormsModule } from "@angular/forms";
import { mockAutocompleteItems } from "./search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { RouterTestingModule } from "@angular/router/testing";
import { SearchApi } from "./api/search.api";
import { ALL_URLS_WITHOUT_HEADER, AppComponent } from "./app.component";
import { isMobileView } from "./common/app.helpers";
import { SearchService } from "./search/search.service";
import { NavigationService } from "./services/navigation.service";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthApi } from "./api/auth.api";
import { ModalService } from "./components/modal/modal.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import ProjectLinks from "./project-links";
import { routerMock, routerMockEventSubject } from "./common/base-test.helpers.spec";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { mockAccountDetails, mockAccountFromAccessToken } from "./api/mock/auth.mock";
import { FetchAccountDetailsGQL } from "./api/kamu.graphql.interface";
import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { SpinnerComponent } from "./components/spinner/spinner/spinner.component";
import { LoggedUserService } from "./auth/logged-user.service";
import { LoginService } from "./auth/login/login.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountTabs } from "./account/account.constants";

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
            imports: [
                RouterTestingModule,
                ApolloTestingModule,
                MatMenuModule,
                NgbTypeaheadModule,
                FormsModule,
                HttpClientTestingModule,
            ],
            declarations: [AppComponent, ModalComponent, AppHeaderComponent, SpinnerComponent],
            providers: [
                SearchService,
                SearchApi,
                AuthApi,
                NavigationService,
                ModalService,
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ query: DEFAULT_SEARCH_QUERY }),
                    },
                },
            ],
        }).compileComponents();

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

    it("should check call onAppLogo method", () => {
        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch").and.returnValue();
        component.onAppLogo();
        expect(navigateToSearchSpy).toHaveBeenCalledWith();
    });

    it("should check call onAddNew method", () => {
        const navigateToDatasetCreateSpy = spyOn(navigationService, "navigateToDatasetCreate").and.returnValue();
        component.onAddNew();
        expect(navigateToDatasetCreateSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogout method", () => {
        const logoutSpy = spyOn(loggedUserService, "logout").and.returnValue();
        component.onLogout();
        expect(logoutSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogin method", () => {
        const loginSpy = spyOn(navigationService, "navigateToLogin").and.returnValue();
        component.onLogin();
        expect(loginSpy).toHaveBeenCalledWith();
    });

    it("should check call onSelectDataset method and navigate to dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.returnValue();
        component.onSelectedDataset(mockAutocompleteItems[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAutocompleteItems[0].dataset.owner.accountName,
            datasetName: mockAutocompleteItems[0].dataset.name,
        });
    });

    it("should check call onSelectDataset method and navigate to search", () => {
        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch").and.returnValue();
        component.onSelectedDataset(mockAutocompleteItems[1]);
        expect(navigateToSearchSpy).toHaveBeenCalledWith(mockAutocompleteItems[1].dataset.id);
    });

    it("should check call onUserProfile", () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToOwnerView").and.returnValue();
        const currentUserSpy = spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(
            mockAccountDetails,
        );
        component.onUserProfile();
        expect(currentUserSpy).toHaveBeenCalledWith();
        expect(navigationServiceSpy).toHaveBeenCalledWith(mockAccountDetails.accountName, AccountTabs.OVERVIEW);
    });

    ALL_URLS_WITHOUT_HEADER.forEach((url: string) => {
        it(`should hide header when going to ${url} page`, () => {
            routerMockEventSubject.next(new NavigationEnd(1, url, ""));
            fixture.detectChanges();
            expect(component.isHeaderVisible).toBeFalse();
        });
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
