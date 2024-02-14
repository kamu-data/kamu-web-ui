import { NavigationService } from "../../../../../../../services/navigation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetNamePropertyComponent } from "./dataset-name-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("DatasetNamePropertyComponent", () => {
    let component: DatasetNamePropertyComponent;
    let fixture: ComponentFixture<DatasetNamePropertyComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetNamePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNamePropertyComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.data = { datasetName: "test", ownerAccountName: "testOwner" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to dataset page", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.navigateToDatasetView();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: component.data.ownerAccountName,
            datasetName: component.data.datasetName,
            tab: DatasetViewTypeEnum.Overview,
            page: 1,
        });
    });
});
