import { RouterTestingModule } from "@angular/router/testing";
import { AccountFragment, AccountType } from "src/app/api/kamu.graphql.interface";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    dispatchInputEvent,
    getElementByDataTestId,
    findNativeElement,
    routerMockEventSubject,
    findElementByDataTestId,
    emitClickOnElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { AppHeaderComponent } from "./app-header.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchApi } from "src/app/api/search.api";
import { of } from "rxjs";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { first } from "rxjs/operators";
import AppValues from "src/app/common/app.values";
import { ActivatedRoute, NavigationEnd, RouterModule } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { NotificationIndicatorComponent } from "../notification-indicator/notification-indicator.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginMethod } from "src/app/app-config.model";

describe("AppHeaderComponent", () => {
    let component: AppHeaderComponent;
    let fixture: ComponentFixture<AppHeaderComponent>;
    let searchApi: SearchApi;
    let navigationService: NavigationService;
    const DEFAULT_SEARCH_QUERY = "defaultSearchQuery";
    function pushNavigationEnd(): void {
        routerMockEventSubject.next(new NavigationEnd(1, ProjectLinks.URL_SEARCH, ""));
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatMenuModule,
                FormsModule,
                BrowserModule,
                NgbTypeaheadModule,
                RouterTestingModule,
                ApolloTestingModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                RouterModule,
            ],
            declarations: [AppHeaderComponent, NotificationIndicatorComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ query: DEFAULT_SEARCH_QUERY }),
                    },
                },
            ],
        })
            .overrideComponent(AppHeaderComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AppHeaderComponent);
        component = fixture.componentInstance;
        component.loggedAccount = {
            id: "",
            accountName: "",
            displayName: AppValues.DEFAULT_USER_DISPLAY_NAME,
            accountType: AccountType.User,
            isAdmin: false,
        };
        component.featureFlags = {
            enableLogout: true,
            enableScheduling: true,
            enableDatasetEnvVarsManagment: true,
        };
        component.loginMethods = [LoginMethod.GITHUB, LoginMethod.PASSWORD];
        component.isVisible = true;
        component.isMobileView = false;
        fixture.detectChanges();
        searchApi = TestBed.inject(SearchApi);
        navigationService = TestBed.inject(NavigationService);
    });

    function loginUser(): void {
        component.loggedAccount = {
            id: "someId",
            accountName: "ssss",
            displayName: "testName",
            accountType: AccountType.User,
        } as AccountFragment;
        fixture.detectChanges();
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initial value search input", () => {
        pushNavigationEnd();
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.searchQuery).toEqual(DEFAULT_SEARCH_QUERY);
    });

    it("should check focus on input", () => {
        const searchInput = getElementByDataTestId(fixture, "searchInput");
        const focusElementSpy = spyOn(searchInput, "focus").and.callThrough();
        component.onClickInput();
        expect(focusElementSpy).toHaveBeenCalledTimes(1);
    });

    it("should check dataset type", () => {
        expect(component.isDatasetType(TypeNames.datasetType)).toBeTrue();
        expect(component.isDatasetType(TypeNames.allDataType)).toBeFalse();
    });

    [false, true].forEach((isExpectation: boolean) => {
        it(`should ${isExpectation ? "close" : "open"} header menu`, () => {
            component.isCollapsedAppHeaderMenu = isExpectation;
            const headerMenu = findNativeElement(fixture, "#app-header");
            emitClickOnElementByDataTestId(fixture, "appHeaderMenuButton");
            isExpectation
                ? expect(headerMenu.classList.contains("details--on")).toBeFalse()
                : expect(headerMenu.classList.contains("details--on")).toBeTrue();
        });
    });

    it("should emit on click Login link", () => {
        const emitterSubscription$ = component.onClickedLogin.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "loginHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should not have Login link when user is logged in", () => {
        loginUser();
        const link = findElementByDataTestId(fixture, "loginHeader");
        expect(link).toBeUndefined();
    });

    it("should not have Login link when login feature is disabled", () => {
        component.loginMethods = [];
        fixture.detectChanges();

        const link = findElementByDataTestId(fixture, "loginHeader");
        expect(link).toBeUndefined();
    });

    it("should emit on click Billing link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedBilling.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openBillingPlanHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Analytics link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedAnalytics.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openAnalyticsHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    // TODO: test userNameHeader and it's content

    it("should emit on click Log out link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedLogout.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openLogoutHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("no Log Out link when feature disabled", () => {
        loginUser();
        component.featureFlags = {
            ...component.featureFlags,
            enableLogout: false,
        };
        fixture.detectChanges();

        const link = findElementByDataTestId(fixture, "openLogoutHeader");
        expect(link).toBeUndefined();
    });

    [
        "userDatasetsHeader",
        "addNewDatasetHeader",
        "openUserProfileHeader",
        "openBillingPlanHeader",
        "openAnalyticsHeader",
        "openSettingsHeader",
        "userNameHeader",
        "openLogoutHeader",
    ].forEach((linkId: string) => {
        it("should not see header links for logged users when not logged in", () => {
            const link = findElementByDataTestId(fixture, linkId);
            expect(link).toBeUndefined();
        });
    });

    it("should emit on click Help link", () => {
        const emitterSubscription$ = component.onClickedHelp.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openHelpHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should not see add new second link without login", () => {
        const link = findElementByDataTestId(fixture, "addNewBlock");
        expect(link).toBeUndefined();
    });

    describe("clicking header menu", () => {
        beforeEach(() => {
            emitClickOnElementByDataTestId(fixture, "openUserInfoBlock");
            fixture.detectChanges();
        });

        it("should have default user name visible in menu when not logged", () => {
            const nameItem = getElementByDataTestId(fixture, "userName");
            expect(nameItem.innerText).toEqual(AppValues.DEFAULT_USER_DISPLAY_NAME);
        });

        it("should have logged user name visible in menu", () => {
            loginUser();
            const nameItem = getElementByDataTestId(fixture, "userName");
            expect(nameItem.innerText).toEqual("testName");
        });

        it("should emit on click Help link menu", () => {
            const emitterSubscription$ = component.onClickedHelp.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openHelp");
            link.click();
            expect(emitterSubscription$.closed).toBeTrue();
        });

        it("should emit on click Login link menu", () => {
            const emitterSubscription$ = component.onClickedLogin.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openLogin");
            link.click();
            expect(emitterSubscription$.closed).toBeTrue();
        });

        it("should not have Login link menu when user is logged in", () => {
            loginUser();
            const link = findElementByDataTestId(fixture, "openLogin");
            expect(link).toBeUndefined();
        });

        it("should not have Login link menu when login feature is disabled", () => {
            component.loginMethods = [];
            fixture.detectChanges();

            const link = findElementByDataTestId(fixture, "openLogin");
            expect(link).toBeUndefined();
        });

        it("should emit on click Billing link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedBilling.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openBillingPlan");
            link.click();
            expect(emitterSubscription$.closed).toBeTrue();
        });

        it("should emit on click Analytics link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedAnalytics.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openAnalytics");
            link.click();
            expect(emitterSubscription$.closed).toBeTrue();
        });

        it("should emit on click logout link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedLogout.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openLogout");
            link.click();
            expect(emitterSubscription$.closed).toBeTrue();
        });

        it("no Log Out link menu when feature disabled", () => {
            loginUser();
            component.featureFlags = {
                ...component.featureFlags,
                enableLogout: false,
            };
            fixture.detectChanges();

            const link = findElementByDataTestId(fixture, "openLogout");
            expect(link).toBeUndefined();
        });

        [
            "openUserProfile",
            "openUserDatasets",
            "openBillingPlan",
            "openAnalytics",
            "openSettings",
            "openLogout",
        ].forEach((linkId: string) => {
            it("should not see header menus links for logged users when not logged in", () => {
                const link = findElementByDataTestId(fixture, linkId);
                expect(link).toBeUndefined();
            });
        });
    });

    it("should check selection of search suggestion", fakeAsync(() => {
        // Let's assume auto-complete returns 1 hardcoded item
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.allDataType,
            dummy: false,
            dataset: mockDatasetBasicsDerivedFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = spyOn(searchApi, "autocompleteDatasetSearch").and.callFake(() =>
            of([MOCK_AUTOCOMPLETE_ITEM]),
        );

        // Run search query
        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInput", SEARCH_QUERY);
        tick(AppValues.SHORT_DELAY_MS); // debouncer

        // This should activate search API and update view
        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_QUERY);
        fixture.detectChanges();

        // Expect emitter event with hardcoded auto-complete item
        const emitterSubscription$ = component.onSelectedDataset
            .pipe(first())
            .subscribe((item: DatasetAutocompleteItem) => {
                expect(item).toBe(MOCK_AUTOCOMPLETE_ITEM);
            });

        // After click on selection option, search typeahead should hide
        const typeAheadInputEl = findNativeElement(fixture, "#typeahead-http");
        const typeAheadInputElBlurSpy = spyOn(typeAheadInputEl, "blur").and.callThrough();

        // Do actual click
        const typeAheadSelectionEl = findNativeElement(fixture, "button.dropdown-item");
        typeAheadSelectionEl.click();
        fixture.detectChanges();

        // Ensure emitter callback was hit
        expect(emitterSubscription$.closed).toBeTrue();

        // Ensure focus lost on autocomplete after delay
        tick();
        expect(typeAheadInputElBlurSpy).toHaveBeenCalledWith();
        flush();
    }));

    it("should check search method triggers menu click on mobile view", fakeAsync(() => {
        component.isMobileView = true;
        const triggerMenuClickSpy = spyOn(component, "triggerMenuClick").and.callThrough();

        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch");

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = getElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        tick(AppValues.SHORT_DELAY_MS);
        expect(triggerMenuClickSpy).toHaveBeenCalledWith();
        expect(navigateToSearchSpy).toHaveBeenCalledWith(DEFAULT_SEARCH_QUERY);
        flush();
    }));

    it("should check redirect to initial search page", () => {
        component.searchQuery = "";
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = getElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });
});
