/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    DatasetAllFlowsPausedDocument,
    DatasetAllFlowsPausedQuery,
    DatasetFlowType,
    DatasetFlowsInitiatorsDocument,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsDocument,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsDocument,
    DatasetResumeFlowsMutation,
    DatasetTriggerIngestFlowDocument,
    FlowConnectionDataFragment,
    GetDatasetFlowConfigsDocument,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersDocument,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsDocument,
    GetDatasetListFlowsQuery,
    GetFlowByIdDocument,
    GetFlowByIdQuery,
    SetIngestFlowConfigDocument,
    SetDatasetFlowTriggersDocument,
    FlowConfigRuleIngest,
    FlowConfigRuleCompaction,
    SetCompactionFlowConfigDocument,
    DatasetTriggerTransformFlowDocument,
    DatasetTriggerCompactionFlowDocument,
    DatasetTriggerResetFlowDocument,
    DatasetTriggerResetToMetadataFlowDocument,
    FlowTriggerBreakingChangeRule,
    CancelFlowRunMutation,
    CancelFlowRunDocument,
} from "./kamu.graphql.interface";
import { TEST_DATASET_ID } from "./mock/dataset.mock";
import { DatasetFlowApi } from "./dataset-flow.api";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockTimeDeltaInput,
    mockDatasetTriggerIngestFlowMutation,
    mockCancelFlowRunMutationSuccess,
    mockGetDatasetListFlowsQuery,
    mockGetFlowByIdQuerySuccess,
    mockDatasetFlowsInitiatorsQuery,
    mockSetIngestFlowConfigMutation,
    mockSetDatasetFlowTriggersSuccess,
    mockGetDatasetFlowTriggersCronQuery,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationSuccess,
    mockDatasetAllFlowsPausedQuery,
    mockRetryPolicyInput,
    mockCompactingGetDatasetFlowConfigsSuccess,
    mockSetCompactionFlowConfigMutation,
    mockSetCompactionFlowConfigMutationError,
    mockDatasetTriggerTransformFlowMutation,
    mockDatasetTriggerCompactionFlowMutation,
    mockDatasetTriggerResetFlowMutation,
    mockDatasetTriggerResetToMetadataFlowMutation,
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
                const configRule = configType?.rule;
                expect(configRule?.__typename).toEqual("FlowConfigRuleIngest");
                expect((configRule as FlowConfigRuleIngest)?.fetchUncacheable).toEqual(false);
            });

        const op = controller.expectOne(GetDatasetFlowConfigsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockIngestGetDatasetFlowConfigsSuccess,
        });
    });

    it("should check getDatasetFlowConfigs with datasetFlowType=HARD_COMPACTION", () => {
        service
            .getDatasetFlowConfigs({ datasetId: TEST_DATASET_ID, datasetFlowType: DatasetFlowType.HardCompaction })
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                const configType = res.datasets.byId?.flows.configs.byType;
                const configRule = configType?.rule;
                expect(configRule?.__typename).toEqual("FlowConfigRuleCompaction");

                const compactionConfig = configRule as FlowConfigRuleCompaction;

                expect(compactionConfig).toBeDefined();
                expect(compactionConfig).toEqual({
                    __typename: "FlowConfigRuleCompaction",
                    maxSliceSize: 1000000,
                    maxSliceRecords: 50000,
                });
            });

        const op = controller.expectOne(GetDatasetFlowConfigsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockCompactingGetDatasetFlowConfigsSuccess,
        });
    });

    it("should check setDatasetFlowIngestConfig", () => {
        service
            .setDatasetFlowIngestConfig({
                datasetId: TEST_DATASET_ID,
                ingestConfigInput: { fetchUncacheable: true },
                retryPolicyInput: null,
            })
            .subscribe();

        const op = controller.expectOne(SetIngestFlowConfigDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.ingestConfigInput).toEqual({ fetchUncacheable: true });
        expect(op.operation.variables.retryPolicyInput).toBeNull();

        op.flush({
            data: mockSetIngestFlowConfigMutation,
        });
    });

    it("should check setDatasetFlowIngestConfig with retry input", () => {
        service
            .setDatasetFlowIngestConfig({
                datasetId: TEST_DATASET_ID,
                ingestConfigInput: { fetchUncacheable: true },
                retryPolicyInput: mockRetryPolicyInput,
            })
            .subscribe();

        const op = controller.expectOne(SetIngestFlowConfigDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.ingestConfigInput).toEqual({ fetchUncacheable: true });
        expect(op.operation.variables.retryPolicyInput).toEqual(mockRetryPolicyInput);

        op.flush({
            data: mockSetIngestFlowConfigMutation,
        });
    });

    it("should check setDatasetCompactionFlowConfigs", () => {
        service
            .setDatasetFlowCompactionConfig({
                datasetId: TEST_DATASET_ID,
                compactionConfigInput: {
                    maxSliceSize: 1000000,
                    maxSliceRecords: 50000,
                },
            })
            .subscribe();

        const op = controller.expectOne(SetCompactionFlowConfigDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.compactionConfigInput).toEqual({
            maxSliceSize: 1000000,
            maxSliceRecords: 50000,
        });

        op.flush({
            data: mockSetCompactionFlowConfigMutation,
        });
    });

    it("should check setDatasetCompactionFlowConfigs with retry input", () => {
        service
            .setDatasetFlowCompactionConfig({
                datasetId: TEST_DATASET_ID,
                compactionConfigInput: {
                    maxSliceSize: 1000000,
                    maxSliceRecords: 50000,
                },
            })
            .subscribe();

        const op = controller.expectOne(SetCompactionFlowConfigDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.compactionConfigInput).toEqual({
            maxSliceSize: 1000000,
            maxSliceRecords: 50000,
        });
        op.flush({
            data: mockSetCompactionFlowConfigMutationError,
        });
    });

    it("should check setDatasetFlowTriggers", () => {
        service
            .setDatasetFlowTriggers({
                datasetId: TEST_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: false,
                triggerRuleInput: {
                    reactive: {
                        forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
                        forNewData: {
                            buffering: {
                                maxBatchingInterval: mockTimeDeltaInput,
                                minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
                            },
                        },
                    },
                },
                triggerStopPolicyInput: {
                    never: {
                        dummy: true,
                    },
                },
            })
            .subscribe();

        const op = controller.expectOne(SetDatasetFlowTriggersDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.ExecuteTransform);

        op.flush({
            data: mockSetDatasetFlowTriggersSuccess,
        });
    });

    it("should check datasetTriggerIngestFlow", () => {
        service
            .datasetTriggerIngestFlow({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe();

        const op = controller.expectOne(DatasetTriggerIngestFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDatasetTriggerIngestFlowMutation,
        });
    });

    it("should check datasetTriggerTransformFlow", () => {
        service
            .datasetTriggerTransformFlow({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe();

        const op = controller.expectOne(DatasetTriggerTransformFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDatasetTriggerTransformFlowMutation,
        });
    });

    it("should check datasetTriggerCompactionlow", () => {
        service
            .datasetTriggerCompactionFlow({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe();

        const op = controller.expectOne(DatasetTriggerCompactionFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.compactionConfigInput).toBeUndefined();

        op.flush({
            data: mockDatasetTriggerCompactionFlowMutation,
        });
    });

    it("should check datasetTriggerResetFlow", () => {
        service
            .datasetTriggerResetFlow({
                datasetId: TEST_DATASET_ID,
                resetConfigInput: {
                    mode: {
                        toSeed: {},
                    },
                },
            })
            .subscribe();

        const op = controller.expectOne(DatasetTriggerResetFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.resetConfigInput).toEqual({
            mode: {
                toSeed: {},
            },
        });

        op.flush({
            data: mockDatasetTriggerResetFlowMutation,
        });
    });

    it("should check datasetTriggerResetToMetadataFlow", () => {
        service
            .datasetTriggerResetToMetadataFlow({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe();

        const op = controller.expectOne(DatasetTriggerResetToMetadataFlowDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockDatasetTriggerResetToMetadataFlowMutation,
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
                    mockGetDatasetFlowTriggersCronQuery.datasets.byId?.flows.triggers.byType?.paused,
                );
                expect(res.datasets.byId?.flows.triggers.byType?.schedule?.__typename).toEqual(
                    "Cron5ComponentExpression",
                );
            });

        const op = controller.expectOne(GetDatasetFlowTriggersDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetFlowType).toEqual(DatasetFlowType.Ingest);
        op.flush({
            data: mockGetDatasetFlowTriggersCronQuery,
        });
    });

    it("should check cancel scheduled tasks", () => {
        service
            .cancelFlowRun({
                datasetId: TEST_DATASET_ID,
                flowId: MOCK_FLOW_ID,
            })
            .subscribe((res: CancelFlowRunMutation) => {
                expect(res.datasets.byId?.flows.runs.cancelFlowRun.message).toEqual("Success");
            });

        const op = controller.expectOne(CancelFlowRunDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.flowId).toEqual(MOCK_FLOW_ID);
        op.flush({
            data: mockCancelFlowRunMutationSuccess,
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
            })
            .subscribe((res: DatasetPauseFlowsMutation) => {
                expect(res.datasets.byId?.flows.triggers.pauseFlows).toEqual(true);
            });

        const op = controller.expectOne(DatasetPauseFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        op.flush({
            data: mockDatasetPauseFlowsMutationSuccess,
        });
    });

    it("should check datasetResumeFlows", () => {
        service
            .datasetResumeFlows({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe((res: DatasetResumeFlowsMutation) => {
                expect(res.datasets.byId?.flows.triggers.resumeFlows).toEqual(true);
            });

        const op = controller.expectOne(DatasetResumeFlowsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
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
