import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDividerModule } from "@angular/material/divider";
import { mockFullPowerDatasetPermissionsFragment } from "../../../search/mock.data";
import _ from "lodash";
import { ReactiveFormsModule } from "@angular/forms";
import { GeneralComponent } from "./components/general/general.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SchedulingComponent } from "./components/scheduling/scheduling.component";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "../../../common/shared-test.module";

describe("DatasetSettingsComponent", () => {
    let component: DatasetSettingsComponent;
    let fixture: ComponentFixture<DatasetSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsComponent, GeneralComponent, SchedulingComponent],
            imports: [
                AngularSvgIconModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
                MatDividerModule,
                ReactiveFormsModule,
                ApolloTestingModule,
                MatIconModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsComponent);
        component = fixture.componentInstance;
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
