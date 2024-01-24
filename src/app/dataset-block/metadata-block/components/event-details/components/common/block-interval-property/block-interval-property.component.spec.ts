import { mockDatasetMainDataResponse } from "../../../../../../../search/mock.data";
import { DatasetService } from "../../../../../../../dataset-view/dataset.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockIntervalPropertyComponent } from "./block-interval-property.component";
import { of } from "rxjs";
import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
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
            prevBlockHash: "f1620a798caf694d544a7ad590fa2230e4c518de1acce010789d0056c61a1fa69d95a",
            newBlockHash: "f162050f7d722779b38215a3770b905842b7214599d80aff1d9479288b5a056a005e2",
            datasetId: "did:odf:fed015c38ec1ae4b02f6f02d78c8ff2752bed730833efb6e9bf431259acdc08f5e27c",
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should sheck call requestDatasetInfoById from datasetSevice in ngOnInit", () => {
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
});
