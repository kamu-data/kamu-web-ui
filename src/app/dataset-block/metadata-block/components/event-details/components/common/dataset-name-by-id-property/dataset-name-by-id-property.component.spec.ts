import { DatasetInfo } from "./../../../../../../../interface/navigation.interface";
import { NavigationService } from "./../../../../../../../services/navigation.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetNameByIdPropertyComponent } from "./dataset-name-by-id-property.component";
import { of } from "rxjs";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("DatasetIdAndNamePropertyComponent", () => {
    let component: DatasetNameByIdPropertyComponent;
    let fixture: ComponentFixture<DatasetNameByIdPropertyComponent>;
    let datasetSevice: DatasetService;
    let navigationService: NavigationService;

    const testDatasetInfo: DatasetInfo = {
        accountName: "testAccountName",
        datasetName: "testDatasetName",
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetNameByIdPropertyComponent],
            imports: [ApolloTestingModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNameByIdPropertyComponent);
        datasetSevice = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetInfo = testDatasetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call requestDatasetInfoById from datasetSevice in ngOnInit", () => {
        const requestDatasetInfoByIdSpy = spyOn(
            datasetSevice,
            "requestDatasetInfoById",
        ).and.returnValue(
            of({
                __typename: "Query",
                datasets: {
                    __typename: "Datasets",
                    byId: mockDatasetMainDataResponse.datasets.byOwnerAndName,
                },
            }),
        );
        component.ngOnInit();
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should check navigate to dataset view", () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.navigateToDatasetView();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining(testDatasetInfo),
        );
    });
});
