/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";

import { of } from "rxjs";
import { first } from "rxjs/operators";

import { Apollo } from "apollo-angular";

import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    findNativeElement,
    getElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { AccountProvider, AccountType } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { AppHeaderComponent } from "src/app/header/app-header/app-header.component";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("AppHeaderComponent", () => {
    let component: AppHeaderComponent;
    let fixture: ComponentFixture<AppHeaderComponent>;
    let searchApi: SearchApi;
    let navigationService: NavigationService;
    const DEFAULT_SEARCH_QUERY = "defaultSearchQuery";
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppHeaderComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: of(
                            convertToParamMap({ [ProjectLinks.URL_QUERY_PARAM_QUERY]: DEFAULT_SEARCH_QUERY }),
                        ),
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AppHeaderComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "loggedAccount", {
            __typename: "Account",
            id: "",
            accountName: "",
            displayName: AppValues.DEFAULT_USER_DISPLAY_NAME,
            accountType: AccountType.User,
            isAdmin: false,
            accountProvider: AccountProvider.Password,
        });
        setComponentInput(fixture, "featureFlags", {
            enableLogout: true,
            enableScheduling: true,
            enableDatasetEnvVarsManagement: true,
            enableTermsOfService: true,
            allowAnonymous: true,
        });
        setComponentInput(fixture, "loginMethods", [AccountProvider.OauthGithub, AccountProvider.Password]);
        setComponentInput(fixture, "isVisible", true);
        setComponentInput(fixture, "isMobileView", false);
        fixture.detectChanges();
        searchApi = TestBed.inject(SearchApi);
        navigationService = TestBed.inject(NavigationService);
    });

    function loginUser(): void {
        setComponentInput(fixture, "loggedAccount", {
            __typename: "Account",
            id: "someId",
            accountName: "ssss",
            displayName: "testName",
            accountType: AccountType.User,
            accountProvider: AccountProvider.Password,
        });
        fixture.detectChanges();
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should take the initial search query from the route", () => {
        expect(component.searchQuery).toEqual(DEFAULT_SEARCH_QUERY);
    });

    it("should take the search query from the URL after a navigation", async () => {
        await TestBed.inject(Router).navigateByUrl(`/?${ProjectLinks.URL_QUERY_PARAM_QUERY}=navigated`);
        expect(component.searchQuery).toEqual("navigated");
    });

    it("should check focus on input", () => {
        const searchInput = getElementByDataTestId(fixture, "searchInput");
        const focusElementSpy = vi.spyOn(searchInput, "focus");
        component.onClickInput();
        expect(focusElementSpy).toHaveBeenCalledTimes(1);
    });

    it("should check dataset type", () => {
        expect(component.isDatasetType(TypeNames.datasetType)).toBe(true);
        expect(component.isDatasetType(TypeNames.allDataType)).toBe(false);
    });

    [false, true].forEach((isExpectation: boolean) => {
        it(`should ${isExpectation ? "close" : "open"} header menu`, () => {
            component.isCollapsedAppHeaderMenu = isExpectation;
            const headerMenu = findNativeElement(fixture, "#app-header");
            emitClickOnElementByDataTestId(fixture, "appHeaderMenuButton");
            fixture.detectChanges();
            if (isExpectation) {
                expect(headerMenu.classList.contains("details--on")).toBe(false);
            } else {
                expect(headerMenu.classList.contains("details--on")).toBe(true);
            }
        });
    });

    it("should emit on click Login link", () => {
        const emitterSubscription$ = component.onClickedLogin.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "loginHeader");
        link.click();
        expect(emitterSubscription$.closed).toBe(true);
    });

    it("should not have Login link when user is logged in", () => {
        loginUser();
        const link = findElementByDataTestId(fixture, "loginHeader");
        expect(link).toBeUndefined();
    });

    it("should emit on click Billing link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedBilling.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openBillingPlanHeader");
        link.click();
        expect(emitterSubscription$.closed).toBe(true);
    });

    it("should emit on click Analytics link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedAnalytics.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openAnalyticsHeader");
        link.click();
        expect(emitterSubscription$.closed).toBe(true);
    });

    // TODO: test userNameHeader and it's content

    it("should emit on click Log out link", () => {
        loginUser();
        const emitterSubscription$ = component.onClickedLogout.pipe(first()).subscribe();
        const link = getElementByDataTestId(fixture, "openLogoutHeader");
        link.click();
        expect(emitterSubscription$.closed).toBe(true);
    });

    it("no Log Out link when feature disabled", () => {
        loginUser();
        setComponentInput(fixture, "featureFlags", {
            ...component.featureFlags,
            enableLogout: false,
        });
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
        expect(emitterSubscription$.closed).toBe(true);
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
            expect(emitterSubscription$.closed).toBe(true);
        });

        it("should emit on click Login link menu", () => {
            const emitterSubscription$ = component.onClickedLogin.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openLogin");
            link.click();
            expect(emitterSubscription$.closed).toBe(true);
        });

        it("should not have Login link menu when user is logged in", () => {
            loginUser();
            const link = findElementByDataTestId(fixture, "openLogin");
            expect(link).toBeUndefined();
        });

        it("should emit on click Billing link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedBilling.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openBillingPlan");
            link.click();
            expect(emitterSubscription$.closed).toBe(true);
        });

        it("should emit on click Analytics link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedAnalytics.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openAnalytics");
            link.click();
            expect(emitterSubscription$.closed).toBe(true);
        });

        it("should emit on click logout link menu", () => {
            loginUser();
            const emitterSubscription$ = component.onClickedLogout.pipe(first()).subscribe();
            const link = getElementByDataTestId(fixture, "openLogout");
            link.click();
            expect(emitterSubscription$.closed).toBe(true);
        });

        it("no Log Out link menu when feature disabled", () => {
            loginUser();
            setComponentInput(fixture, "featureFlags", {
                ...component.featureFlags,
                enableLogout: false,
            });
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
        const searchApiAutocompleteDatasetSearchSpy = vi
            .spyOn(searchApi, "autocompleteDatasetSearch")
            .mockImplementation(() => of([MOCK_AUTOCOMPLETE_ITEM]));

        // Run search query
        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInput", SEARCH_QUERY);
        tick(AppValues.SHORT_DELAY_MS); // debouncer

        // This should activate search API and update view
        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_QUERY);
        fixture.detectChanges();

        expect(component.searching).toEqual(false);

        // Expect emitter event with hardcoded auto-complete item
        const emitterSubscription$ = component.onSelectedDataset
            .pipe(first())
            .subscribe((item: DatasetAutocompleteItem) => {
                expect(item).toBe(MOCK_AUTOCOMPLETE_ITEM);
            });

        // After click on selection option, search typeahead should hide
        const typeAheadInputEl = findNativeElement(fixture, "#typeahead-http");
        const typeAheadInputElBlurSpy = vi.spyOn(typeAheadInputEl, "blur");

        // Do actual click
        const typeAheadSelectionEl = findNativeElement(fixture, "button.dropdown-item");
        typeAheadSelectionEl.click();
        fixture.detectChanges();

        // Ensure emitter callback was hit
        expect(emitterSubscription$.closed).toBe(true);

        // Ensure focus lost on autocomplete after delay
        tick();
        expect(typeAheadInputElBlurSpy).toHaveBeenCalledWith();
        flush();
    }));

    it("should open the highlighted suggestion on Enter, not search for it", fakeAsync(() => {
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.datasetType,
            dummy: false,
            dataset: mockDatasetBasicsDerivedFragment,
        };
        vi.spyOn(searchApi, "autocompleteDatasetSearch").mockReturnValue(of([MOCK_AUTOCOMPLETE_ITEM]));
        const navigateToSearchSpy = stubMethod(navigationService, "navigateToSearch");
        const navigateToHomeSpy = stubMethod(navigationService, "navigateToHome");
        const selectedItems: DatasetAutocompleteItem[] = [];
        component.onSelectedDataset.subscribe((item: DatasetAutocompleteItem) => selectedItems.push(item));

        dispatchInputEvent(fixture, "searchInput", "query");
        tick(AppValues.SHORT_DELAY_MS);
        fixture.detectChanges();

        const searchInput = getElementByDataTestId(fixture, "searchInput");
        searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        searchInput.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
        tick(AppValues.SHORT_DELAY_MS);

        expect(selectedItems).toEqual([MOCK_AUTOCOMPLETE_ITEM]);
        expect(navigateToSearchSpy).not.toHaveBeenCalled();
        expect(navigateToHomeSpy).not.toHaveBeenCalled();
        flush();
    }));

    it("should check search method triggers menu click on mobile view", fakeAsync(() => {
        setComponentInput(fixture, "isMobileView", true);
        const triggerMenuClickSpy = vi.spyOn(component, "triggerMenuClick");

        const navigateToSearchSpy = vi.spyOn(navigationService, "navigateToSearch").mockImplementation(() => {});

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = getElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        tick(AppValues.SHORT_DELAY_MS);
        expect(triggerMenuClickSpy).toHaveBeenCalledWith();
        expect(component.isCollapsedAppHeaderMenu).toBe(true);
        expect(navigateToSearchSpy).toHaveBeenCalledWith(DEFAULT_SEARCH_QUERY);
        flush();
    }));

    it("should check redirect to initial search page", () => {
        component.searchQuery = "";
        const navigateToHomeSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = getElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });
});
