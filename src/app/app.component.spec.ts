import { FormsModule } from "@angular/forms";
import { mockDataDataset } from "./search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterTestingModule } from "@angular/router/testing";
import { SearchApi } from "./api/search.api";
import { AppComponent } from "./app.component";
import AppValues from "./common/app.values";
import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { AppSearchService } from "./search/search.service";
import { NavigationService } from "./services/navigation.service";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthApi } from "./api/auth.api";
import { ModalService } from "./components/modal/modal.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalComponent } from "./components/modal/modal.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AccountDetailsFragment } from "./api/kamu.graphql.interface";

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
                AppSearchService,
                SearchApi,
                AuthApi,
                NavigationService,
                ModalService,
            ],
        }).compileComponents();
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

    it(`should have as logo 'kamu-client'`, async () => {
        await expect(component.appLogo).toEqual(
            "/assets/icons/kamu_logo_icon.svg",
        );
    });

    it("should check call authentification method in onInit ", async () => {
        const mockAccountDetailsFragment: AccountDetailsFragment = {
            login: "testLogin",
            name: "testName",
        };
        authApi.userChange(mockAccountDetailsFragment);
        const authentificationSpy = spyOn(component, "authentification");
        component.ngOnInit();
        await expect(component.user).toEqual(mockAccountDetailsFragment);
        await expect(authentificationSpy).toHaveBeenCalled();
    });

    it("should check call checkWindowSize method", async () => {
        const checkWindowSizeSpy = spyOn(component, "checkWindowSize");
        window.dispatchEvent(new Event("resize"));
        await expect(checkWindowSizeSpy).toHaveBeenCalled();
        await expect(component.isMobileView).toEqual(AppValues.isMobileView());
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
        component.onSelectDataset(mockDataDataset[0]);
        await expect(navigateToDatasetViewSpy).toHaveBeenCalled();
    });

    it("should check call onSelectDataset method and navigate to search", async () => {
        const navigateToSearchSpy = spyOn(
            navigationService,
            "navigateToSearch",
        ).and.returnValue();
        component.onSelectDataset(mockDataDataset[1]);
        await expect(navigateToSearchSpy).toHaveBeenCalled();
    });

    it("should check call onUserProfile", async () => {
        const modalSpy = spyOn(modalService, "warning").and.callThrough();
        component.onUserProfile();
        await expect(modalSpy).toHaveBeenCalled();
    });
});
