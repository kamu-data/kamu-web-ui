import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
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
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

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
            ],
            declarations: [DatasetViewMenuComponent, DataAccessPanelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
