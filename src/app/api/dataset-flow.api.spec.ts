import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    CancelScheduledTasksDocument,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedDocument,
    DatasetAllFlowsPausedQuery,
    DatasetFlowType,
    DatasetFlowsInitiatorsDocument,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsDocument,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsDocument,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowDocument,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    GetDatasetFlowConfigsDocument,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersDocument,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsDocument,
    GetDatasetListFlowsQuery,
    GetFlowByIdDocument,
    GetFlowByIdQuery,
    SetDatasetFlowConfigDocument,
    SetDatasetFlowConfigMutation,
    SetDatasetFlowTriggersDocument,
    SetDatasetFlowTriggersMutation,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_ID, TEST_DATASET_ID } from "./mock/dataset.mock";
import { DatasetFlowApi } from "./dataset-flow.api";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockTimeDeltaInput,
    mockDatasetTriggerFlowMutation,
    mockCancelScheduledTasksMutationSuccess,
    mockGetDatasetListFlowsQuery,
    mockGetFlowByIdQuerySuccess,
    mockDatasetFlowsInitiatorsQuery,
    mockSetDatasetFlowConfigMutation,
    mockSetDatasetFlowTriggersSuccess,
    mockGetDatasetFlowTriggersQuery,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationSuccess,
    mockDatasetAllFlowsPausedQuery,
} from "./mock/dataset-flow.mock";

describe("DatasetFlowApi", () => {
    let service: DatasetFlowApi;
    let controller: ApolloTestingController;
    const MOCK_MIN_RECORDS_TO_AWAIT = 12;
    const MOCK_FLOW_ID = "10";
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
                expect(configType?.ingest?.fetchUncacheable).toEqual(false);
            });

        const op = controller.expectOne(GetDatasetFlowConfigsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);

        op.flush({
            data: mockIngestGetDatasetFlowConfigsSuccess,
        });
    });

    it("should check setDatasetFlowConfigs with datasetFlowType=EXECUTE_TRANSFORM", () => {
        service
            .setDatasetFlowConfigs({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                configInput: { ingest: { fetchUncacheable: true } },
            })
            .subscribe((res: SetDatasetFlowConfigMutation) => {
                if (res.datasets.byId?.flows.configs.setConfig.__typename === "SetFlowConfigSuccess")
                    expect(mockSetDatasetFlowConfigMutation.datasets.byId?.flows.configs.setConfig.message).toEqual(
                        "Success",
                    );
            });

        const op = controller.expectOne(SetDatasetFlowConfigDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.ExecuteTransform);

        op.flush({
            data: mockSetDatasetFlowConfigMutation,
        });
    });

    it("should check setDatasetFlowTriggers with datasetFlowType=EXECUTE_TRANSFORM", () => {
        service
            .setDatasetFlowTriggers({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                triggerInput: {
                    batching: {
                        maxBatchingInterval: mockTimeDeltaInput,
                        minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
                    },
                },
            })
            .subscribe((res: SetDatasetFlowTriggersMutation) => {
                if (res.datasets.byId?.flows.triggers.setTrigger.__typename === "SetFlowTriggerSuccess")
                    expect(mockSetDatasetFlowConfigMutation.datasets.byId?.flows.configs.setConfig.message).toEqual(
                        "Success",
                    );
            });

        const op = controller.expectOne(SetDatasetFlowTriggersDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.ExecuteTransform);

        op.flush({
            data: mockSetDatasetFlowTriggersSuccess,
        });
    });

    it("should check datasetTriggerFlow", () => {
        service
            .datasetTriggerFlow({
                accountId: TEST_ACCOUNT_ID,
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

    it("should check getDatasetFlowTriggers", () => {
        service
            .getDatasetFlowTriggers({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.Ingest,
            })
            .subscribe((res: GetDatasetFlowTriggersQuery) => {
                expect(res.datasets.byId?.flows.triggers.byType?.paused).toEqual(
                    mockGetDatasetFlowTriggersQuery.datasets.byId?.flows.triggers.byType?.paused,
                );
                expect(res.datasets.byId?.flows.triggers.byType?.schedule?.__typename).toEqual(
                    "Cron5ComponentExpression",
                );
            });

        const op = controller.expectOne(GetDatasetFlowTriggersDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        op.flush({
            data: mockGetDatasetFlowTriggersQuery,
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

    it("should check getDatasetListFlows", () => {
        service
            .getDatasetListFlows({
                datasetId: TEST_DATASET_ID,
                page: MOCK_PAGE,
                perPageTable: MOCK_PER_PAGE,
                perPageTiles: MOCK_PER_PAGE,
                filters: MOCK_FILTERS,
            })
            .subscribe((res: GetDatasetListFlowsQuery) => {
                expect((res.datasets.byId?.flows.runs.table as FlowConnectionDataFragment).totalCount).toEqual(2);
            });

        const op = controller.expectOne(GetDatasetListFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.page).toEqual(MOCK_PAGE);
        expect(op.operation.variables.perPageTable).toEqual(MOCK_PER_PAGE);
        expect(op.operation.variables.perPageTiles).toEqual(MOCK_PER_PAGE);
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
                expect(res.datasets.byId?.flows.triggers.pauseFlows).toEqual(true);
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
                expect(res.datasets.byId?.flows.triggers.resumeFlows).toEqual(true);
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
            expect(res.datasets.byId?.flows.triggers.allPaused).toEqual(true);
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

    it("should check getDatasetFlowsInitiators", () => {
        service.getDatasetFlowsInitiators(TEST_DATASET_ID).subscribe((res: DatasetFlowsInitiatorsQuery) => {
            expect(res.datasets.byId?.flows.runs.listFlowInitiators.nodes.length).toEqual(
                mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators.nodes.length,
            );
        });

        const op = controller.expectOne(DatasetFlowsInitiatorsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDatasetFlowsInitiatorsQuery,
        });
    });
});
