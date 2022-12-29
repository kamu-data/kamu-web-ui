import AppValues from "src/app/common/app.values";
import { DatasetNavigationInterface } from "./../dataset-view.interface";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu-component";
import {
    emitClickOnElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DatasetViewMenuComponent", () => {
    let component: DatasetViewMenuComponent;
    let fixture: ComponentFixture<DatasetViewMenuComponent>;

    const mockNavigationObject = {
        navigateToOverview: () => null,
        navigateToData: () => null,
        navigateToMetadata: () => null,
        navigateToHistory: () => null,
        navigateToLineage: () => null,
        navigateToDiscussions: () => null,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatMenuModule, FormsModule, BrowserAnimationsModule],
            declarations: [DatasetViewMenuComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        component.datasetNavigation = mockNavigationObject;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    Object.keys(mockNavigationObject).forEach((item) => {
        it(`should check ${item} on click button`, () => {
            const navigateSpy = spyOn(
                component.datasetNavigation,
                item as keyof DatasetNavigationInterface,
            ).and.callThrough();
            emitClickOnElement(fixture, `[data-test-id=${item}]`);
            fixture.detectChanges();
            if (item === "navigateToHistory" || item === "navigateToMetadata") {
                expect(navigateSpy).toHaveBeenCalledWith(1);
            } else {
                expect(navigateSpy).toHaveBeenCalledWith();
            }
        });
    });

    it("should copy to clipboard", fakeAsync(() => {
        emitClickOnElement(fixture, '[data-test-id="searchAdditionalButtons"]');

        const menu = findElementByDataTestId(fixture, "menu");
        expect(menu).toBeDefined();

        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboard",
        );
        emitClickOnElement(fixture, '[data-test-id="copyToClipboard"]');
        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(false);

        flush();
    }));
});
