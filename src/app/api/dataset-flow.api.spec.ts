import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    DatasetFlowBatchingDocument,
    DatasetFlowBatchingMutation,
    DatasetFlowScheduleDocument,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    GetDatasetFlowConfigsDocument,
    GetDatasetFlowConfigsQuery,
} from "./kamu.graphql.interface";
import { TEST_DATASET_ID } from "./mock/dataset.mock";
import { DatasetFlowApi } from "./dataset-flow.api";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockBatchingGetDatasetFlowConfigsSuccess,
    mockTimeDeltaInput,
    mockSetDatasetFlowScheduleSuccess,
    mockSetDatasetFlowBatchingSuccess,
} from "./mock/dataset-flow.mock";

describe("DatasetFlowApi", () => {
    let service: DatasetFlowApi;
    let controller: ApolloTestingController;
    const MOCK_PAUSED = true;
    const MOCK_MINIMAL_DATA_BATCH = 12;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatasetFlowApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetFlowApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check getDatasetFlowConfigs with datasetFlowType=INGEST", () => {
        service
            .getDatasetFlowConfigs({ datasetId: TEST_DATASET_ID, datasetFlowType: DatasetFlowType.Ingest })
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                const configType = res.datasets.byId?.flows.configs.byType;
                const mockConfigType = mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType;
                expect(configType?.paused).toEqual(mockConfigType?.paused);
                expect(configType?.batching).toEqual(null);
                if (
                    configType?.schedule?.__typename === "TimeDelta" &&
                    mockConfigType?.schedule?.__typename === "TimeDelta"
                ) {
                    expect(configType.schedule).toEqual(mockConfigType.schedule);
                }
            });

        const op = controller.expectOne(GetDatasetFlowConfigsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);

        op.flush({
            data: mockIngestGetDatasetFlowConfigsSuccess,
        });
    });

    it("should check getDatasetFlowConfigs with datasetFlowType=EXECUTE_TRANSFORM", () => {
        service
            .getDatasetFlowConfigs({ datasetId: TEST_DATASET_ID, datasetFlowType: DatasetFlowType.ExecuteTransform })
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                const configType = res.datasets.byId?.flows.configs.byType;
                const mockConfigType = mockBatchingGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType;
                expect(configType?.paused).toEqual(mockConfigType?.paused);
                expect(configType?.schedule).toEqual(null);
                if (
                    configType?.batching?.throttlingPeriod?.__typename === "TimeDelta" &&
                    mockConfigType?.batching?.throttlingPeriod?.__typename === "TimeDelta"
                ) {
                    expect(configType.batching.throttlingPeriod).toEqual(mockConfigType.batching.throttlingPeriod);
                }
                expect(configType?.batching?.minimalDataBatch).toEqual(mockConfigType?.batching?.minimalDataBatch);
            });

        const op = controller.expectOne(GetDatasetFlowConfigsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.ExecuteTransform);

        op.flush({
            data: mockBatchingGetDatasetFlowConfigsSuccess,
        });
    });

    it("should check setDatasetFlowSchedule", () => {
        service
            .setDatasetFlowSchedule({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: MOCK_PAUSED,
                schedule: { timeDelta: mockTimeDeltaInput },
            })
            .subscribe((res: DatasetFlowScheduleMutation) => {
                expect(res.datasets.byId?.flows.configs.setConfigSchedule.message).toEqual("Success");
            });

        const op = controller.expectOne(DatasetFlowScheduleDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        expect(op.operation.variables.paused).toEqual(MOCK_PAUSED);
        expect(op.operation.variables.schedule).toEqual({ timeDelta: mockTimeDeltaInput });
        op.flush({
            data: mockSetDatasetFlowScheduleSuccess,
        });
    });

    it("should check setDatasetFlowBatching", () => {
        service
            .setDatasetFlowBatching({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: MOCK_PAUSED,
                throttlingPeriod: mockTimeDeltaInput,
                minimalDataBatch: MOCK_MINIMAL_DATA_BATCH,
            })
            .subscribe((res: DatasetFlowBatchingMutation) => {
                expect(res.datasets.byId?.flows.configs.setConfigBatching.message).toEqual("Success");
            });

        const op = controller.expectOne(DatasetFlowBatchingDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        expect(op.operation.variables.paused).toEqual(MOCK_PAUSED);
        expect(op.operation.variables.throttlingPeriod).toEqual(mockTimeDeltaInput);
        expect(op.operation.variables.minimalDataBatch).toEqual(MOCK_MINIMAL_DATA_BATCH);
        op.flush({
            data: mockSetDatasetFlowBatchingSuccess,
        });
    });
});
