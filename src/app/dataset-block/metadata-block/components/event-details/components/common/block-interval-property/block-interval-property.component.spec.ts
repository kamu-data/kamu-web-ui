import { mockDatasetMainDataResponse } from "./../../../../../../../search/mock.data";
import { DatasetService } from "./../../../../../../../dataset-view/dataset.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockIntervalPropertyComponent } from "./block-interval-property.component";
import { of } from "rxjs";
import { DisplayHashModule } from "src/app/components/display-hash/dispaly-hash.module";
import { ToastrModule } from "ngx-toastr";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("BlockIntervalPropertyComponent", () => {
    let component: BlockIntervalPropertyComponent;
    let fixture: ComponentFixture<BlockIntervalPropertyComponent>;
    let datasetSevice: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockIntervalPropertyComponent],
            imports: [
                ApolloTestingModule,
                DisplayHashModule,
                ToastrModule.forRoot(),
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockIntervalPropertyComponent);
        datasetSevice = TestBed.inject(DatasetService);
        component = fixture.componentInstance;
        component.data = {
            block: { start: "0", end: "10" },
            datasetId: "testId",
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should sheck call requestDatasetInfoById from datasetSevice in ngOnInit", () => {
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
});
