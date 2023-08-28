import { RouterTestingModule } from "@angular/router/testing";
import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    dispatchInputEvent,
    emitClickOnElement,
    findElementByDataTestId,
    findNativeElement,
    routerMock,
    routerMockEventSubject,
} from "src/app/common/base-test.helpers.spec";
import { AppHeaderComponent } from "./app-header.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchApi } from "src/app/api/search.api";
import { of } from "rxjs";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { first } from "rxjs/operators";
import AppValues from "src/app/common/app.values";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { NotificationIndicatorComponent } from "../notification-indicator/notification-indicator.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";

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
                MatMenuModule,
                FormsModule,
                BrowserModule,
                NgbTypeaheadModule,
                RouterTestingModule,
                ApolloTestingModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
            declarations: [AppHeaderComponent, NotificationIndicatorComponent],
            providers: [
                Apollo,
                { provide: Router, useValue: routerMock },
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
        component.userInfo = {
            login: "",
            name: AppValues.DEFAULT_USERNAME,
        };
        component.isVisible = true;
        component.isMobileView = false;
        fixture.detectChanges();
        searchApi = TestBed.inject(SearchApi);
        navigationService = TestBed.inject(NavigationService);
    });

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
        const searchInput = findElementByDataTestId(fixture, "searchInput");
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
            emitClickOnElement(fixture, "#appHeaderMenuButton");
            isExpectation
                ? expect(headerMenu.classList.contains("details--on")).toBeFalse()
                : expect(headerMenu.classList.contains("details--on")).toBeTrue();
        });
    });

    it("should emit on click app logo", () => {
        const emitterSubscription$ = component.clickAppLogoEmitter.pipe(first()).subscribe();
        const link = findElementByDataTestId(fixture, "appLogo");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Help link", () => {
        const emitterSubscription$ = component.clickHelpEmitter.pipe(first()).subscribe();
        const link = findElementByDataTestId(fixture, "openHelpHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click AddNew link", () => {
        const emitterSubscription$ = component.addNewEmitter.pipe(first()).subscribe();
        const link = findElementByDataTestId(fixture, "addNewDataset");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Settings link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;

        const emitterSubscription$ = component.clickSettingsEmitter.pipe(first()).subscribe();

        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSettingsHeader");
        link.click();

        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Your profile link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;

        const emitterSubscription$ = component.clickUserProfileEmitter.pipe(first()).subscribe();

        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();

        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Analytics link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;

        const emitterSubscription$ = component.clickAnalyticsEmitter.pipe(first()).subscribe();

        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openAnalyticsHeader");
        link.click();

        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click LogOut link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;

        const emitterSubscription$ = component.logOutEmitter.pipe(first()).subscribe();

        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSignOutHeader");
        link.click();

        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Login link", () => {
        const emitterSubscription$ = component.loginEmitter.pipe(first()).subscribe();
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Billing link", () => {
        const emitterSubscription$ = component.clickBillingEmitter.pipe(first()).subscribe();
        const link = findElementByDataTestId(fixture, "openBillingPlanHeader");
        link.click();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click Your datasets link", () => {
        const emitterSubscription$ = component.clickUserDatasetsEmitter.pipe(first()).subscribe();
        component.onUserDatasets();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should emit on click User Info link", () => {
        const emitterSubscription$ = component.userProfileEmitter.pipe(first()).subscribe();
        component.onOpenUserInfo();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should check selection of search suggestion", fakeAsync(() => {
        // Let's assume auto-complete returns 1 hardcoded item
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.allDataType,
            dataset: mockDatasetBasicsFragment,
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
        const emitterSubscription$ = component.selectDatasetEmitter
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
        const el = findElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        tick(AppValues.SHORT_DELAY_MS);
        expect(triggerMenuClickSpy).toHaveBeenCalledWith();
        expect(navigateToSearchSpy).toHaveBeenCalledWith(DEFAULT_SEARCH_QUERY);
    }));

    it("should check redirect to initial search page", () => {
        component.searchQuery = "";
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = findElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });
});
