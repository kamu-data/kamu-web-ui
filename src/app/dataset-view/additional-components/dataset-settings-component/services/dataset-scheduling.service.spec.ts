import { TestBed } from "@angular/core/testing";
import { DatasetSchedulingService } from "./dataset-scheduling.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockSetDatasetFlowBatchingError,
    mockSetDatasetFlowBatchingSuccess,
    mockSetDatasetFlowScheduleError,
    mockSetDatasetFlowScheduleSuccess,
} from "src/app/api/mock/dataset-flow.mock";
import { DatasetFlowType, ScheduleInput, TimeUnit } from "src/app/api/kamu.graphql.interface";

describe("DatasetSchedulingService", () => {
    let service: DatasetSchedulingService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";
    const MOCK_DATASET_FLOW_TYPE = DatasetFlowType.Ingest;
    const MOCK_PAUSED = false;
    const MOCK_SCHEDULE: ScheduleInput = {
        timeDelta: {
            every: 1,
            unit: TimeUnit.Minutes,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetSchedulingService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check set dataset flow schedule with success", () => {
        const successMessage = mockSetDatasetFlowScheduleSuccess.datasets.byId?.flows.configs.setConfigSchedule.message;
        spyOn(datasetFlowApi, "setDatasetFlowSchedule").and.returnValue(of(mockSetDatasetFlowScheduleSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service
            .setDatasetFlowSchedule({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: MOCK_DATASET_FLOW_TYPE,
                paused: MOCK_PAUSED,
                schedule: MOCK_SCHEDULE,
            })
            .subscribe(() => {
                expect(toastrServiceSuccessSpy).toHaveBeenCalledWith(successMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check set dataset flow schedule with error", () => {
        const errorMessage = mockSetDatasetFlowScheduleError.datasets.byId?.flows.configs.setConfigSchedule.message;
        spyOn(datasetFlowApi, "setDatasetFlowSchedule").and.returnValue(of(mockSetDatasetFlowScheduleError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetFlowSchedule({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: MOCK_DATASET_FLOW_TYPE,
                paused: MOCK_PAUSED,
                schedule: MOCK_SCHEDULE,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(errorMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check set dataset flow batching with success", () => {
        const successMessage = mockSetDatasetFlowBatchingSuccess.datasets.byId?.flows.configs.setConfigBatching.message;
        spyOn(datasetFlowApi, "setDatasetFlowBatching").and.returnValue(of(mockSetDatasetFlowBatchingSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service
            .setDatasetFlowBatching({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                minimalDataBatch: null,
                throttlingPeriod: null,
            })
            .subscribe(() => {
                expect(toastrServiceSuccessSpy).toHaveBeenCalledWith(successMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check set dataset flow batching with error", () => {
        const errorMessage = mockSetDatasetFlowBatchingError.datasets.byId?.flows.configs.setConfigBatching.message;
        spyOn(datasetFlowApi, "setDatasetFlowBatching").and.returnValue(of(mockSetDatasetFlowBatchingError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetFlowBatching({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                minimalDataBatch: null,
                throttlingPeriod: null,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(errorMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
