import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetViewHeaderComponent } from "./dataset-view-header.component";
import { mockDatasetInfo, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { SearchAdditionalButtonsComponent } from "src/app/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/components/search-additional-buttons/search-additional-buttons-nav.component";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetVisibilityModule } from "src/app/components/dataset-visibility/dataset-visibility.module";

describe("DatasetViewHeaderComponent", () => {
    let component: DatasetViewHeaderComponent;
    let fixture: ComponentFixture<DatasetViewHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetViewHeaderComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
            ],
            imports: [
                MatIconModule,
                MatMenuModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                RouterModule,
                SharedTestModule,
                DatasetVisibilityModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetViewHeaderComponent);
        component = fixture.componentInstance;
        component.datasetInfo = mockDatasetInfo;
        component.datasetVisibility = mockPublicDatasetVisibility;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onClickSearchAdditionalButtonEmit is emit", () => {
        const methodName = "test name";
        const onClickSearchAdditionalButtonEmitSpy = spyOn(component.onClickSearchAdditionalButtonEmit, "emit");
        component.onClickSearchAdditionalButton(methodName);
        expect(onClickSearchAdditionalButtonEmitSpy).toHaveBeenCalledWith(methodName);
    });
});
