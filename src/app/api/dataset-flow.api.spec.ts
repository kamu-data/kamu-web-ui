import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    CancelScheduledTasksDocument,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedDocument,
    DatasetAllFlowsPausedQuery,
    DatasetFlowBatchingDocument,
    DatasetFlowBatchingMutation,
    DatasetFlowCompactingDocument,
    DatasetFlowCompactingMutation,
    DatasetFlowScheduleDocument,
    DatasetFlowScheduleMutation,
    DatasetFlowType,
    DatasetPauseFlowsDocument,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsDocument,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowDocument,
    DatasetTriggerFlowMutation,
    GetDatasetFlowConfigsDocument,
    GetDatasetFlowConfigsQuery,
    GetDatasetListFlowsDocument,
    GetDatasetListFlowsQuery,
    GetFlowByIdDocument,
    GetFlowByIdQuery,
} from "./kamu.graphql.interface";
import { TEST_DATASET_ID } from "./mock/dataset.mock";
import { DatasetFlowApi } from "./dataset-flow.api";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockBatchingGetDatasetFlowConfigsSuccess,
    mockTimeDeltaInput,
    mockSetDatasetFlowScheduleSuccess,
    mockSetDatasetFlowBatchingSuccess,
    mockDatasetTriggerFlowMutation,
    mockCancelScheduledTasksMutationSuccess,
    mockDatasetFlowCompactingMutationSuccess,
    mockGetDatasetListFlowsQuery,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationSuccess,
    mockDatasetAllFlowsPausedQuery,
    mockGetFlowByIdQuerySuccess,
} from "./mock/dataset-flow.mock";

describe("DatasetFlowApi", () => {
    let service: DatasetFlowApi;
    let controller: ApolloTestingController;
    const MOCK_PAUSED = true;
    const MOCK_MIN_RECORDS_TO_AWAIT = 12;
    const MOCK_FLOW_ID = "10";
    const MOCK_SLICE_SIZE = 10 * Math.pow(2, 10);
    const MOCK_SLICE_RECORDS = 100000;
    const MOCK_PAGE = 1;
    const MOCK_PER_PAGE = 15;
    const MOCK_FILTERS = {};

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
                expect(configType?.batching?.maxBatchingInterval).toEqual(
                    mockConfigType?.batching?.maxBatchingInterval,
                );
                expect(configType?.batching?.minRecordsToAwait).toEqual(mockConfigType?.batching?.minRecordsToAwait);
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
                if (res.datasets.byId?.flows.configs.setConfigSchedule.__typename === "SetFlowConfigSuccess") {
                    expect(res.datasets.byId.flows.configs.setConfigSchedule.message).toEqual("Success");
                }
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
                batching: {
                    maxBatchingInterval: mockTimeDeltaInput,
                    minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
                },
            })
            .subscribe((res: DatasetFlowBatchingMutation) => {
                expect(res.datasets.byId?.flows.configs.setConfigBatching.message).toEqual("Success");
            });

        const op = controller.expectOne(DatasetFlowBatchingDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        expect(op.operation.variables.paused).toEqual(MOCK_PAUSED);
        expect(op.operation.variables.batching).toEqual({
            maxBatchingInterval: mockTimeDeltaInput,
            minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
        });
        op.flush({
            data: mockSetDatasetFlowBatchingSuccess,
        });
    });

    it("should check datasetTriggerFlow", () => {
        service
            .datasetTriggerFlow({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
            })
            .subscribe((res: DatasetTriggerFlowMutation) => {
                expect(res.datasets.byId?.flows.runs.triggerFlow.message).toEqual("Success");
            });

        const op = controller.expectOne(DatasetTriggerFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        op.flush({
            data: mockDatasetTriggerFlowMutation,
        });
    });

    it("should check cancel scheduled tasks", () => {
        service
            .cancelScheduledTasks({
                datasetId: TEST_DATASET_ID,
                flowId: MOCK_FLOW_ID,
            })
            .subscribe((res: CancelScheduledTasksMutation) => {
                expect(res.datasets.byId?.flows.runs.cancelScheduledTasks.message).toEqual("Success");
            });

        const op = controller.expectOne(CancelScheduledTasksDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.flowId).toEqual(MOCK_FLOW_ID);
        op.flush({
            data: mockCancelScheduledTasksMutationSuccess,
        });
    });

    it("should check setDatasetFlowCompacting", () => {
        service
            .setDatasetFlowCompacting({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.HardCompacting,
                compactingArgs: {
                    full: {
                        maxSliceSize: MOCK_SLICE_SIZE,
                        maxSliceRecords: MOCK_SLICE_RECORDS,
                    },
                },
            })
            .subscribe((res: DatasetFlowCompactingMutation) => {
                expect(res.datasets.byId?.flows.configs.setConfigCompacting.message).toEqual("Success");
            });

        const op = controller.expectOne(DatasetFlowCompactingDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.HardCompacting);
        op.flush({
            data: mockDatasetFlowCompactingMutationSuccess,
        });
    });

    it("should check getDatasetListFlows", () => {
        service
            .getDatasetListFlows({
                datasetId: TEST_DATASET_ID,
                page: MOCK_PAGE,
                perPage: MOCK_PER_PAGE,
                filters: MOCK_FILTERS,
            })
            .subscribe((res: GetDatasetListFlowsQuery) => {
                expect(res.datasets.byId?.flows.runs.listFlows.totalCount).toEqual(2);
            });

        const op = controller.expectOne(GetDatasetListFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.page).toEqual(MOCK_PAGE);
        expect(op.operation.variables.perPage).toEqual(MOCK_PER_PAGE);
        expect(op.operation.variables.filters).toEqual(MOCK_FILTERS);
        op.flush({
            data: mockGetDatasetListFlowsQuery,
        });
    });

    it("should check datasetPauseFlows", () => {
        service
            .datasetPauseFlows({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
            })
            .subscribe((res: DatasetPauseFlowsMutation) => {
                expect(res.datasets.byId?.flows.configs.pauseFlows).toEqual(true);
            });

        const op = controller.expectOne(DatasetPauseFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        op.flush({
            data: mockDatasetPauseFlowsMutationSuccess,
        });
    });

    it("should check datasetResumeFlows", () => {
        service
            .datasetResumeFlows({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
            })
            .subscribe((res: DatasetResumeFlowsMutation) => {
                expect(res.datasets.byId?.flows.configs.resumeFlows).toEqual(true);
            });

        const op = controller.expectOne(DatasetResumeFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        op.flush({
            data: mockDatasetResumeFlowsMutationSuccess,
        });
    });

    it("should check allFlowsPaused", () => {
        service.allFlowsPaused(TEST_DATASET_ID).subscribe((res: DatasetAllFlowsPausedQuery) => {
            expect(res.datasets.byId?.flows.configs.allPaused).toEqual(true);
        });

        const op = controller.expectOne(DatasetAllFlowsPausedDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDatasetAllFlowsPausedQuery,
        });
    });

    it("should check getFlowById", () => {
        service.getFlowById({ datasetId: TEST_DATASET_ID, flowId: MOCK_FLOW_ID }).subscribe((res: GetFlowByIdQuery) => {
            expect(res.datasets.byId?.flows.runs.getFlow.__typename).toEqual("GetFlowSuccess");
        });

        const op = controller.expectOne(GetFlowByIdDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.flowId).toEqual(MOCK_FLOW_ID);
        op.flush({
            data: mockGetFlowByIdQuerySuccess,
        });
    });
});
