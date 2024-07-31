import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DataAccessPanelComponent } from "src/app/components/data-access-panel/data-access-panel.component";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/shared-test.module";

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
                AngularSvgIconModule.forRoot(),
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
});
