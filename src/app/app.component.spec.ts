import { FormsModule } from "@angular/forms";
import { mockAutocompleteItems } from "./search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterTestingModule } from "@angular/router/testing";
import { SearchApi } from "./api/search.api";
import {
    ALL_URLS_WITHOUT_ACCESS_TOKEN,
    ALL_URLS_WITHOUT_HEADER,
    AppComponent,
} from "./app.component";
import AppValues from "./common/app.values";
import { isMobileView } from "./common/app.helpers";
import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { SearchService } from "./search/search.service";
import { NavigationService } from "./services/navigation.service";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthApi } from "./api/auth.api";
import { ModalService } from "./components/modal/modal.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalComponent } from "./components/modal/modal.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import ProjectLinks from "./project-links";
import {
    routerMock,
    routerMockEventSubject,
} from "./common/base-test.helpers.spec";
import { NavigationEnd, Router } from "@angular/router";
import { mockUserInfoFromAccessToken } from "./api/mock/auth.mock";
import { FetchAccountInfoGQL } from "./api/kamu.graphql.interface";

describe("AppComponent", () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navigationService: NavigationService;
    let modalService: ModalService;
    let authApi: AuthApi;
    let fetchAccountInfoGQL: FetchAccountInfoGQL;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                ApolloTestingModule,
                MatMenuModule,
                NgbTypeaheadModule,
                FormsModule,
            ],
            declarations: [AppComponent, AppHeaderComponent, ModalComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                SearchService,
                SearchApi,
                AuthApi,
                NavigationService,
                ModalService,
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();
        routerMock.url = ProjectLinks.URL_HOME;
        fixture = TestBed.createComponent(AppComponent);
        navigationService = TestBed.inject(NavigationService);
        modalService = TestBed.inject(ModalService);
        authApi = TestBed.inject(AuthApi);
        fetchAccountInfoGQL = TestBed.inject(FetchAccountInfoGQL);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    ProjectLinks.ALL_URLS.filter(
        (url) => !ALL_URLS_WITHOUT_ACCESS_TOKEN.includes(url),
    ).forEach((url: string) => {
        it(`should call authentification method in onInit for ${url} and trigger token restore`, () => {
            const someToken = "someToken";
            const authentificationSpy = spyOn(
                component,
                "authentification",
            ).and.callThrough();
            const localStorageGetItemSpy = spyOn(
                localStorage,
                "getItem",
            ).and.returnValue(someToken);
            const fetchUserInfoFromAccessTokenSpy = spyOn(
                authApi,
                "fetchUserInfoFromAccessToken",
            ).and.callFake(() => of());
            const isAuthenticatedSpy = spyOnProperty(
                authApi,
                "isAuthenticated",
                "get",
            ).and.returnValue(false);

            routerMock.url = url;
            component.ngOnInit();

            expect(authentificationSpy).toHaveBeenCalledWith();
            expect(localStorageGetItemSpy).toHaveBeenCalledWith(
                AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
            );
            expect(fetchUserInfoFromAccessTokenSpy).toHaveBeenCalledWith(
                someToken,
            );
            expect(isAuthenticatedSpy).toHaveBeenCalledWith();
        });
    });

    ALL_URLS_WITHOUT_ACCESS_TOKEN.forEach((url: string) => {
        it(`should call authentification method in onInit on ${url} without token restore`, () => {
            const authentificationSpy = spyOn(
                component,
                "authentification",
            ).and.callThrough();
            const localStorageGetItemSpy = spyOn(
                localStorage,
                "getItem",
            ).and.stub();
            const fetchUserInfoFromAccessTokenSpy = spyOn(
                authApi,
                "fetchUserInfoFromAccessToken",
            ).and.stub();
            const isAuthenticatedSpy = spyOnProperty(
                authApi,
                "isAuthenticated",
                "get",
            ).and.stub();

            routerMock.url = url;
            component.ngOnInit();

            expect(authentificationSpy).toHaveBeenCalledWith();
            expect(localStorageGetItemSpy).not.toHaveBeenCalled();
            expect(fetchUserInfoFromAccessTokenSpy).not.toHaveBeenCalled();
            expect(isAuthenticatedSpy).not.toHaveBeenCalled();
        });
    });

    it("should check call checkWindowSize method", () => {
        const checkWindowSizeSpy = spyOn(
            component,
            "checkWindowSize",
        ).and.callThrough();
        window.dispatchEvent(new Event("resize"));
        expect(checkWindowSizeSpy).toHaveBeenCalledWith();
        expect(component.isMobileView).toEqual(isMobileView());
    });

    it("should check call onClickAppLogo method", () => {
        const navigateToSearchSpy = spyOn(
            navigationService,
            "navigateToSearch",
        ).and.returnValue();
        component.onClickAppLogo();
        expect(navigateToSearchSpy).toHaveBeenCalledWith();
    });

    it("should check call onAddNew method", () => {
        const navigateToDatasetCreateSpy = spyOn(
            navigationService,
            "navigateToDatasetCreate",
        ).and.returnValue();
        component.onAddNew();
        expect(navigateToDatasetCreateSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogOut method", () => {
        const logOutSpy = spyOn(authApi, "logOut").and.returnValue();
        component.onLogOut();
        expect(logOutSpy).toHaveBeenCalledWith();
    });

    it("should check call onLogin method", () => {
        const loginSpy = spyOn(
            navigationService,
            "navigateToLogin",
        ).and.returnValue();
        component.onLogin();
        expect(loginSpy).toHaveBeenCalledWith();
    });

    it("should check call onSelectDataset method and navigate to dataset", () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        ).and.returnValue();
        component.onSelectDataset(mockAutocompleteItems[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAutocompleteItems[0].dataset.owner.name,
            datasetName: mockAutocompleteItems[0].dataset.name as string,
        });
    });

    it("should check call onSelectDataset method and navigate to search", () => {
        const navigateToSearchSpy = spyOn(
            navigationService,
            "navigateToSearch",
        ).and.returnValue();
        component.onSelectDataset(mockAutocompleteItems[1]);
        expect(navigateToSearchSpy).toHaveBeenCalledWith(
            mockAutocompleteItems[1].dataset.id as string,
        );
    });

    it("should check call onUserProfile", () => {
        const modalSpy = spyOn(modalService, "warning").and.resolveTo();
        component.onUserProfile();
        expect(modalSpy).toHaveBeenCalledWith({
            message: AppValues.UNIMPLEMENTED_MESSAGE,
            yesButtonText: "Ok",
        });
    });

    ALL_URLS_WITHOUT_HEADER.forEach((url: string) => {
        it(`should hide header when going to ${url} page`, () => {
            routerMockEventSubject.next(new NavigationEnd(1, url, ""));
            fixture.detectChanges();
            expect(component.isHeaderVisible).toBeFalse();
        });
    });

    ProjectLinks.ALL_URLS.filter(
        (url) => !ALL_URLS_WITHOUT_HEADER.includes(url),
    ).forEach((url: string) => {
        it(`should show header when going to ${url} page`, () => {
            routerMockEventSubject.next(new NavigationEnd(1, url, ""));
            fixture.detectChanges();
            expect(component.isHeaderVisible).toBeTrue();
        });
    });

    it("should react on login/logout changes", () => {
        spyOn(fetchAccountInfoGQL, "mutate").and.returnValue(
            of({
                loading: false,
                data: mockUserInfoFromAccessToken,
            }),
        );
        authApi.fetchUserInfoFromAccessToken("someToken").subscribe();

        expect(component.user).toEqual(
            mockUserInfoFromAccessToken.auth.accountInfo,
        );

        authApi.terminateSession();
        expect(component.user).toEqual(AppComponent.AnonymousAccountInfo);
    });
});
