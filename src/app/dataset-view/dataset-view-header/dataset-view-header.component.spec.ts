import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetViewHeaderComponent } from "./dataset-view-header.component";
import { mockDatasetInfo, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SearchAdditionalButtonsModule } from "src/app/common/components/search-additional-buttons/search-additional-buttons.module";

describe("DatasetViewHeaderComponent", () => {
    let component: DatasetViewHeaderComponent;
    let fixture: ComponentFixture<DatasetViewHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetViewHeaderComponent],
            imports: [
                MatIconModule,
                MatMenuModule,
                HttpClientTestingModule,
                RouterModule,
                SharedTestModule,
                DatasetVisibilityModule,
                SearchAdditionalButtonsModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

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
