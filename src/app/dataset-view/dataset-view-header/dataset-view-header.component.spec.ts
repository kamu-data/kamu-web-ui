import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetViewHeaderComponent } from "./dataset-view-header.component";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { SearchAdditionalButtonsComponent } from "src/app/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/components/search-additional-buttons/search-additional-buttons-nav.component";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { registerMatSvgIcons } from "src/app/common/base-test.helpers.spec";

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
                HttpClientTestingModule,
                RouterModule,
                SharedTestModule,
                SharedModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetViewHeaderComponent);
        component = fixture.componentInstance;
        component.datasetInfo = mockDatasetInfo;
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
