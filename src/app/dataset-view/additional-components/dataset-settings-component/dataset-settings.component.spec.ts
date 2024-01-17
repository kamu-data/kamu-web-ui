import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { DatasetSettingsGeneralTabComponent } from "./tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./tabs/scheduling/dataset-settings-scheduling-tab.component";

describe("DatasetSettingsComponent", () => {
    let component: DatasetSettingsComponent;
    let fixture: ComponentFixture<DatasetSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetSettingsComponent,
                DatasetSettingsGeneralTabComponent,
                DatasetSettingsSchedulingTabComponent,
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => null,
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return mockDatasetBasicsDerivedFragment.owner.accountName;
                                        case "datasetName":
                                            return mockDatasetBasicsDerivedFragment.name;
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ReactiveFormsModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                ApolloTestingModule,
                ToastrModule.forRoot(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
