import AppValues from "src/app/common/app.values";
import { DatasetNavigationInterface } from "../dataset-view.interface";
import { FormsModule } from "@angular/forms";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { emitClickOnElementByDataTestId, getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

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
        navigateToSettings: () => null,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                FormsModule,
                BrowserAnimationsModule,
                MatButtonToggleModule,
                MatTabsModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
            declarations: [DatasetViewMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetNavigation = mockNavigationObject;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;

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
            emitClickOnElementByDataTestId(fixture, `${item}`);
            fixture.detectChanges();
            if (item === "navigateToHistory" || item === "navigateToMetadata") {
                expect(navigateSpy).toHaveBeenCalledWith(1);
            } else {
                expect(navigateSpy).toHaveBeenCalledWith();
            }
        });
    });

    it("should copy to clipboard", fakeAsync(() => {
        emitClickOnElementByDataTestId(fixture, "searchAdditionalButtons");

        const menu = getElementByDataTestId(fixture, "menu");
        expect(menu).toBeDefined();

        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboard");
        emitClickOnElementByDataTestId(fixture, "copyToClipboard");
        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(false);

        flush();
    }));
});
