import AppValues from "src/app/common/app.values";
import { NavigationService } from "./../../../../services/navigation.service";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
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
import {
    DatasetFlowType,
    FlowIncompatibleDatasetKind,
    IngestConditionInput,
    TimeUnit,
    TransformConditionInput,
} from "src/app/api/kamu.graphql.interface";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("DatasetSchedulingService", () => {
    let service: DatasetSchedulingService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    let navigationService: NavigationService;
    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";
    const MOCK_DATASET_FLOW_TYPE = DatasetFlowType.Ingest;
    const MOCK_PAUSED = false;
    const MOCK_SCHEDULE: IngestConditionInput = {
        schedule: {
            timeDelta: {
                every: 1,
                unit: TimeUnit.Minutes,
            },
        },
        fetchUncacheable: false,
    };
    const MOCK_BATCHING_CONFIG: TransformConditionInput = {
        minRecordsToAwait: 100,
        maxBatchingInterval: {
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
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check set dataset flow schedule with success", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowSchedule").and.returnValue(of(mockSetDatasetFlowScheduleSuccess));
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        const subscription$ = service
            .setDatasetFlowSchedule({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: MOCK_DATASET_FLOW_TYPE,
                paused: MOCK_PAUSED,
                ingest: MOCK_SCHEDULE,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
                flush();
            });

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check set dataset flow schedule with error", () => {
        const errorMessage = (
            mockSetDatasetFlowScheduleError.datasets.byId?.flows.configs.setConfigIngest as FlowIncompatibleDatasetKind
        ).message;
        spyOn(datasetFlowApi, "setDatasetFlowSchedule").and.returnValue(of(mockSetDatasetFlowScheduleError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetFlowSchedule({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: MOCK_DATASET_FLOW_TYPE,
                paused: MOCK_PAUSED,
                ingest: MOCK_SCHEDULE,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(errorMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check set dataset flow batching with success", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowBatching").and.returnValue(of(mockSetDatasetFlowBatchingSuccess));
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        const subscription$ = service
            .setDatasetFlowBatching({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                transform: MOCK_BATCHING_CONFIG,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
                flush();
            });

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check set dataset flow batching with error", () => {
        const errorMessage = mockSetDatasetFlowBatchingError.datasets.byId?.flows.configs.setConfigTransform.message;
        spyOn(datasetFlowApi, "setDatasetFlowBatching").and.returnValue(of(mockSetDatasetFlowBatchingError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetFlowBatching({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                transform: MOCK_BATCHING_CONFIG,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(errorMessage);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
