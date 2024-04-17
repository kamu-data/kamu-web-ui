import { TestBed } from "@angular/core/testing";
import { DatasetCompactingService } from "./dataset-compacting.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import { DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import {
    mockDatasetFlowCompactingMutationError,
    mockDatasetFlowCompactingMutationSuccess,
} from "src/app/api/mock/dataset-flow.mock";

describe("DatasetCompactingService", () => {
    let service: DatasetCompactingService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    let flowsService: DatasetFlowsService;
    const MOCK_SLICE_SIZE = 10 * Math.pow(2, 10);
    const MOCK_SLICE_RECORDS = 100000;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetCompactingService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
        flowsService = TestBed.inject(DatasetFlowsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check runHardCompaction with success", () => {
        spyOn(flowsService, "datasetTriggerFlow").and.returnValue(of(true));
        spyOn(datasetFlowApi, "setDatasetFlowCompacting").and.returnValue(of(mockDatasetFlowCompactingMutationSuccess));

        const subscription$ = service
            .runHardCompaction({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.HardCompacting,
                compactingArgs: {
                    maxSliceSize: MOCK_SLICE_SIZE,
                    maxSliceRecords: MOCK_SLICE_RECORDS,
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBeTrue();
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check runHardCompaction with error", () => {
        spyOn(datasetFlowApi, "setDatasetFlowCompacting").and.returnValue(of(mockDatasetFlowCompactingMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .runHardCompaction({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.HardCompacting,
                compactingArgs: {
                    maxSliceSize: MOCK_SLICE_SIZE,
                    maxSliceRecords: MOCK_SLICE_RECORDS,
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBeFalse();
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
