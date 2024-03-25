import { DatasetNavigationInterface } from "../dataset-view.interface";
import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DataAccessPanelComponent } from "src/app/components/data-access-panel/data-access-panel.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";

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
        navigateToFlows: () => null,
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
                MatDividerModule,
                MatCheckboxModule,
                MatTooltipModule,
            ],
            declarations: [DatasetViewMenuComponent, DataAccessPanelComponent],
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
});
