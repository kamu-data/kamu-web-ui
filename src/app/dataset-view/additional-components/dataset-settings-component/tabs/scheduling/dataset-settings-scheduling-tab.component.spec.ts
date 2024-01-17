import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { ReactiveFormsModule } from "@angular/forms";

describe("SchedulingComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsSchedulingTabComponent],
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                SharedTestModule,
                MatDividerModule,
                MatSlideToggleModule,
                MatRadioModule,
                ReactiveFormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSchedulingTabComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
