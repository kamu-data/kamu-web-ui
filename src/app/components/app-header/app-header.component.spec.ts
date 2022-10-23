import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    emitClickOnElement,
    findElementByDataTestId,
    findNativeElement,
} from "src/app/common/base-test.helpers.spec";
import { AppHeaderComponent } from "./app-header.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchApi } from "src/app/api/search.api";
import { of } from "rxjs";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "src/app/interface/search.interface";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { first } from "rxjs/operators";
import AppValues from "src/app/common/app.values";

describe("AppHeaderComponent", () => {
    let component: AppHeaderComponent;
    let fixture: ComponentFixture<AppHeaderComponent>;
    let searchApi: SearchApi;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                FormsModule,
                BrowserModule,
                NgbTypeaheadModule,
            ],
            declarations: [AppHeaderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [Apollo],
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
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check focus on input", () => {
        const searchInput = findElementByDataTestId(fixture, "searchInput");
        const focusElementSpy = spyOn(searchInput, "focus").and.callThrough();
        component.onClickInput();
        expect(focusElementSpy).toHaveBeenCalledTimes(1);
    });

    it("should check dataset type", () => {
        expect(component.isDatasetType("Dataset")).toBeTrue();
        expect(component.isDatasetType("all")).toBeFalse();
    });

    [false, true].forEach((isExpectation: boolean) => {
        it(`should ${isExpectation ? "close" : "open"} header menu`, () => {
            component.isCollapsedAppHeaderMenu = isExpectation;
            const headerMenu = findNativeElement(fixture, "#app-header");
            emitClickOnElement(fixture, "#appHeaderMenuButton");
            isExpectation
                ? expect(
                      headerMenu.classList.contains("Details--on"),
                  ).toBeFalse()
                : expect(
                      headerMenu.classList.contains("Details--on"),
                  ).toBeTrue();
        });
    });

    it("should emit on click app logo", () => {
        const clickAppLogoEmitterSpy = spyOn(
            component.clickAppLogoEmitter,
            "emit",
        );
        const link = findElementByDataTestId(fixture, "appLogo");
        link.click();
        expect(clickAppLogoEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Help link", () => {
        const clickHelpEmitterSpy = spyOn(component.clickHelpEmitter, "emit");
        const link = findElementByDataTestId(fixture, "openHelpHeader");
        link.click();
        expect(clickHelpEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click AddNew link", () => {
        const addNewEmitterSpy = spyOn(component.addNewEmitter, "emit");
        const link = findElementByDataTestId(fixture, "addNewDataset");
        link.click();
        expect(addNewEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Settings link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;
        const clickSettingsEmitterSpy = spyOn(
            component.clickSettingsEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSettingsHeader");
        link.click();
        expect(clickSettingsEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Your profile link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;
        const clickUserProfileEmitterSpy = spyOn(
            component.clickUserProfileEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();
        expect(clickUserProfileEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Analytics link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;
        const clickAnalyticsEmitterSpy = spyOn(
            component.clickAnalyticsEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openAnalyticsHeader");
        link.click();
        expect(clickAnalyticsEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click LogOut link", () => {
        component.userInfo = {
            login: "ssss",
            name: "testName",
        } as AccountDetailsFragment;
        const logOutEmitterSpy = spyOn(component.logOutEmitter, "emit");
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSignOutHeader");
        link.click();
        expect(logOutEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Login link", () => {
        const loginEmitterSpy = spyOn(component.loginEmitter, "emit");
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();
        expect(loginEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Billing link", () => {
        const clickBillingEmitterSpy = spyOn(
            component.clickBillingEmitter,
            "emit",
        );
        const link = findElementByDataTestId(fixture, "openBillingPlanHeader");
        link.click();
        expect(clickBillingEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click Your datasets link", () => {
        const clickUserDatasetsEmitterSpy = spyOn(
            component.clickUserDatasetsEmitter,
            "emit",
        );
        component.onUserDatasets();
        expect(clickUserDatasetsEmitterSpy).toHaveBeenCalledWith();
    });

    it("should emit on click User Info link", () => {
        const userProfileEmitterSpy = spyOn(
            component.userProfileEmitter,
            "emit",
        );
        component.onOpenUserInfo();
        expect(userProfileEmitterSpy).toHaveBeenCalledWith();
    });

    it("should check selection of search suggestion", fakeAsync(() => {
        // Let's assume auto-complete returns 1 hardcoded item
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.allDataType,
            dataset: mockDatasetBasicsFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = spyOn(
            searchApi,
            "autocompleteDatasetSearch",
        ).and.callFake(() => of([MOCK_AUTOCOMPLETE_ITEM]));

        // Run search query
        const SEARCH_QUERY = "query";
        const elSearchInput = findElementByDataTestId(
            fixture,
            "searchInput",
        ) as HTMLInputElement;
        elSearchInput.value = SEARCH_QUERY;
        elSearchInput.dispatchEvent(new Event("input"));
        tick(301); // debouncer

        // This should activate search API and update view
        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(
            SEARCH_QUERY,
        );
        fixture.detectChanges();

        // Expect emitter event with hardcoded auto-complete item
        const emitterSubscription$ = component.selectDatasetEmitter
            .pipe(first())
            .subscribe((item: DatasetAutocompleteItem) => {
                expect(item).toBe(MOCK_AUTOCOMPLETE_ITEM);
            });

        // After click on selection option, search typeahead should hide
        const typeAheadInputEl = findNativeElement(fixture, "#typeahead-http");
        const typeAheadInputElBlurSpy = spyOn(
            typeAheadInputEl,
            "blur",
        ).and.callThrough();

        // Do actual click
        const typeAheadSelectionEl = findNativeElement(
            fixture,
            "button.dropdown-item",
        );
        typeAheadSelectionEl.click();
        fixture.detectChanges();

        // Ensure emitter callback was hit
        expect(emitterSubscription$.closed).toBeTrue();

        // Ensure focus lost on autocomplete after delay
        tick(100);
        expect(typeAheadInputElBlurSpy).toHaveBeenCalledWith();
    }));

    it("should check search method triggers menu click on mobile view", fakeAsync(() => {
        component.isMobileView = true;
        const triggerMenuClickSpy = spyOn(
            component,
            "triggerMenuClick",
        ).and.callThrough();

        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = findElementByDataTestId(fixture, "searchInput");
        const elBlurSpy = spyOn(el, "blur").and.callThrough();

        el.dispatchEvent(event);
        tick(201);
        expect(triggerMenuClickSpy).toHaveBeenCalledWith();
        expect(elBlurSpy).toHaveBeenCalledWith();
    }));
});
