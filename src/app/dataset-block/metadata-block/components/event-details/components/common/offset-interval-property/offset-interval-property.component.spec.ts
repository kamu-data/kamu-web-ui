import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OffsetIntervalPropertyComponent } from "./offset-interval-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";
import { of } from "rxjs";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;
    let datasetSevice: DatasetService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OffsetIntervalPropertyComponent],
            imports: [ApolloTestingModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OffsetIntervalPropertyComponent);
        component = fixture.componentInstance;
        datasetSevice = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        (component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: "dddfdf",
        }),
            fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call requestDatasetInfoById from datasetSevice in ngOnInit", () => {
        fixture.detectChanges();
        const requestDatasetInfoByIdSpy = spyOn(datasetSevice, "requestDatasetInfoById").and.returnValue(
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

    it("should check call navigateToQuery", () => {
        (component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: null,
        }),
            fixture.detectChanges();
        const navigateToQuerySpy = spyOn(navigationService, "navigateToDatasetView");
        component.navigateToQuery();
        expect(navigateToQuerySpy).toHaveBeenCalledTimes(1);
    });
});
