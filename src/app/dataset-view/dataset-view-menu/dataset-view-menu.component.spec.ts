import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DataAccessPanelComponent } from "src/app/data-access-panel/data-access-panel.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("DatasetViewMenuComponent", () => {
    let component: DatasetViewMenuComponent;
    let fixture: ComponentFixture<DatasetViewMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [
                MatMenuModule,
                FormsModule,
                BrowserAnimationsModule,
                MatButtonToggleModule,
                MatTabsModule,
                MatIconModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatCheckboxModule,
                MatTooltipModule,
                ApolloModule,
                ApolloTestingModule,
                RouterModule,
                SharedTestModule,
            ],
            declarations: [DatasetViewMenuComponent, DataAccessPanelComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        component.datasetViewType = DatasetViewTypeEnum.Metadata;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check element has appFeatureFlag directive", () => {
        const navigateToDiscussionsElem = findElementByDataTestId(fixture, "navigateToDiscussions");
        expect(navigateToDiscussionsElem?.hasAttribute("appfeatureflag")).toBeTrue();
        expect(navigateToDiscussionsElem?.getAttribute("appfeatureflag")).toEqual("dataset.panel.discussions");
    });
});
