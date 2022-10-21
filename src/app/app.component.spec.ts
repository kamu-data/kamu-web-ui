import { FormsModule } from "@angular/forms";
import { mockAutocompleteItems } from "./search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterTestingModule } from "@angular/router/testing";
import { SearchApi } from "./api/search.api";
import { ALL_URLS_WITHOUT_ACCESS_TOKEN, ALL_URLS_WITHOUT_HEADER, AppComponent } from "./app.component";
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
import { routerMock, routerMockEventSubject } from "./common/base-test.helpers.spec";
import { NavigationEnd, Router } from "@angular/router";
import { mockAccountDetails } from "./api/mock/auth.mock";


describe("AppComponent", () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navigationService: NavigationService;
    let modalService: ModalService;
    let authApi: AuthApi;
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
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", async () => {
        await expect(component).toBeTruthy();
    });

    ProjectLinks.ALL_URLS.filter(url => !ALL_URLS_WITHOUT_ACCESS_TOKEN.includes(url)).forEach(    
        (url: string) => {
            it(`should call authentification method in onInit for ${url} and trigger token restore`, async () => {
                const authentificationSpy = spyOn(component, "authentification").and.callThrough();        
                const localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue('someToken');
                const fetchUserInfoFromAccessTokenSpy = spyOn(authApi, 'fetchUserInfoFromAccessToken').and.callFake(() => of());
                const isAuthenticatedSpy = spyOnProperty(authApi, 'isAuthenticated', 'get').and.returnValue(false);
        
                routerMock.url = url;                
                component.ngOnInit();
        
                await expect(authentificationSpy).toHaveBeenCalled();
                expect(localStorageGetItemSpy).toHaveBeenCalledWith(AppValues.localStorageAccessToken);
                await expect(fetchUserInfoFromAccessTokenSpy).toHaveBeenCalled();
                await expect(isAuthenticatedSpy).toHaveBeenCalled();
            });
        }
    );

    ALL_URLS_WITHOUT_ACCESS_TOKEN.forEach(
        (url: string) => {
            it(`should call authentification method in onInit on ${url} without token restore`, async () => {
                const authentificationSpy = spyOn(component, "authentification").and.callThrough();
                const localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.stub();
                const fetchUserInfoFromAccessTokenSpy = spyOn(authApi, 'fetchUserInfoFromAccessToken').and.stub();
                const isAuthenticatedSpy = spyOnProperty(authApi, 'isAuthenticated', 'get').and.stub();
        
                routerMock.url = url;
                component.ngOnInit();
        
                await expect(authentificationSpy).toHaveBeenCalled();
                await expect(localStorageGetItemSpy).not.toHaveBeenCalled();
                await expect(fetchUserInfoFromAccessTokenSpy).not.toHaveBeenCalled();
                await expect(isAuthenticatedSpy).not.toHaveBeenCalled();
            });            
        }
    );

    it("should check call checkWindowSize method", async () => {
        const checkWindowSizeSpy = spyOn(component, "checkWindowSize").and.callThrough();
        window.dispatchEvent(new Event("resize"));
        await expect(checkWindowSizeSpy).toHaveBeenCalled();
        await expect(component.isMobileView).toEqual(isMobileView());
    });

    it("should check call onClickAppLogo method", async () => {
        const navigateToSearchSpy = spyOn(
            navigationService,
            "navigateToSearch",
        ).and.returnValue();
        component.onClickAppLogo();
        await expect(navigateToSearchSpy).toHaveBeenCalled();
    });

    it("should check call onAddNew method", async () => {
        const navigateToDatasetCreateSpy = spyOn(
            navigationService,
            "navigateToDatasetCreate",
        ).and.returnValue();
        component.onAddNew();
        await expect(navigateToDatasetCreateSpy).toHaveBeenCalled();
    });

    it("should check call onLogOut method", async () => {
        const logOutSpy = spyOn(authApi, "logOut").and.returnValue();
        component.onLogOut();
        await expect(logOutSpy).toHaveBeenCalled();
    });

    it("should check call onLogin method", async () => {
        const loginSpy = spyOn(
            navigationService,
            "navigateToLogin",
        ).and.returnValue();
        component.onLogin();
        await expect(loginSpy).toHaveBeenCalled();
    });

    it("should check call onSelectDataset method and navigate to dataset", async () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        ).and.returnValue();
        component.onSelectDataset(mockAutocompleteItems[0]);
        await expect(navigateToDatasetViewSpy).toHaveBeenCalled();
    });

    it("should check call onSelectDataset method and navigate to search", async () => {
        const navigateToSearchSpy = spyOn(
            navigationService,
            "navigateToSearch",
        ).and.returnValue();
        component.onSelectDataset(mockAutocompleteItems[1]);
        await expect(navigateToSearchSpy).toHaveBeenCalled();
    });

    it("should check call onUserProfile", async () => {
        const modalSpy = spyOn(modalService, "warning").and.callThrough();
        component.onUserProfile();
        await expect(modalSpy).toHaveBeenCalled();
    });

    ALL_URLS_WITHOUT_HEADER.forEach(
        (url: string) => {
            it(`should hide header when going to ${url} page`, async () => {
                routerMockEventSubject.next(new NavigationEnd(1, url, ""));
                fixture.detectChanges();
                await expect(component.isHeaderVisible).toBeFalsy();
            });
        }
    );

    ProjectLinks.ALL_URLS.filter(url => !ALL_URLS_WITHOUT_HEADER.includes(url)).forEach(
        (url: string) => {
            it(`should show header when going to ${url} page`, async () => {
                routerMockEventSubject.next(new NavigationEnd(1, url, ""));
                fixture.detectChanges();
                await expect(component.isHeaderVisible).toBeTruthy();
            });
        }
    )

    it("should accept new logged user", async () => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        authApi['userChanges$'].next(mockAccountDetails);
        await expect(component.user).toEqual(mockAccountDetails);
    });

    it("should accept user logout", async () => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        authApi['userChanges$'].next(null);
        await expect(component.user).toEqual(AppComponent.AnonymousAccountInfo);
    });    
});

