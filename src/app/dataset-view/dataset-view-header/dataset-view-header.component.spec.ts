import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetViewHeaderComponent } from "./dataset-view-header.component";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { SearchAdditionalButtonsComponent } from "src/app/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/components/search-additional-buttons/search-additional-buttons-nav.component";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetViewHeaderComponent", () => {
    let component: DatasetViewHeaderComponent;
    let fixture: ComponentFixture<DatasetViewHeaderComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetViewHeaderComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
            ],
            imports: [MatIconModule, MatMenuModule, AngularSvgIconModule.forRoot(), HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetViewHeaderComponent);
        component = fixture.componentInstance;
        navigationService = TestBed.inject(NavigationService);
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

    it("should check showOwnerPageEmit is emit", () => {
        const showOwnerPageEmitSpy = spyOn(component.showOwnerPageEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "show-owner-link");
        expect(showOwnerPageEmitSpy).toHaveBeenCalledWith();
    });

    it("should check navigate to dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        emitClickOnElementByDataTestId(fixture, "show-dataset-link");
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(mockDatasetInfo);
    });
});
