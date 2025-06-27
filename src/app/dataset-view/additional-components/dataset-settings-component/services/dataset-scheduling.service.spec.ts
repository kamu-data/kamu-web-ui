/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "src/app/common/values/app.values";
import { NavigationService } from "./../../../../services/navigation.service";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetSchedulingService } from "./dataset-scheduling.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockGetDatasetFlowTriggersQuery,
    mockIngestGetDatasetFlowConfigsSuccess,
    mockSetCompactionFlowConfigMutation,
    mockSetDatasetFlowTriggersError,
    mockSetDatasetFlowTriggerSuccess,
    mockSetCompactionFlowConfigMutationError,
} from "src/app/api/mock/dataset-flow.mock";
import {
    FlowConfigCompactionInput,
    DatasetFlowType,
    FlowTriggerInput,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
    FlowConfigRuleIngest,
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
    const MOCK_COMPACTION_INPUT: FlowConfigCompactionInput = {
        full: {
            maxSliceRecords: 10,
            maxSliceSize: 1000,
            recursive: false,
        },
    };
    const MOCK_TRIGGER_INPUT: FlowTriggerInput = {
        batching: {
            minRecordsToAwait: 100,
            maxBatchingInterval: {
                every: 10,
                unit: TimeUnit.Minutes,
            },
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

    it("should check setCompactionFlowConfigs with success", () => {
        spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").and.returnValue(of(mockSetCompactionFlowConfigMutation));
        const subscription$ = service
            .setDatasetCompactionFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: MOCK_COMPACTION_INPUT,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check setDatasetFlowConfigs with error", () => {
        spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").and.returnValue(of(mockSetCompactionFlowConfigMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const subscription$ = service
            .setDatasetCompactionFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: MOCK_COMPACTION_INPUT,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check fetchDatasetFlowConfigs method", () => {
        spyOn(datasetFlowApi, "getDatasetFlowConfigs").and.returnValue(of(mockIngestGetDatasetFlowConfigsSuccess));
        const subscription$ = service
            .fetchDatasetFlowConfigs(MOCK_DATASET_ID, MOCK_DATASET_FLOW_TYPE)
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                expect(res.datasets.byId?.flows.configs.byType?.rule?.__typename).toEqual("FlowConfigRuleIngest");
                expect(mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType?.rule?.__typename).toEqual(
                    "FlowConfigRuleIngest",
                );
                
                const actualIngestRule = res.datasets.byId?.flows.configs.byType?.rule as FlowConfigRuleIngest;
                const expectedIngestRule = mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType?.rule as FlowConfigRuleIngest;
                expect(actualIngestRule.fetchUncacheable).toEqual(expectedIngestRule.fetchUncacheable);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check fetchDatasetFlowTriggers method", () => {
        spyOn(datasetFlowApi, "getDatasetFlowTriggers").and.returnValue(of(mockGetDatasetFlowTriggersQuery));
        const subscription$ = service
            .fetchDatasetFlowTriggers(MOCK_DATASET_ID, MOCK_DATASET_FLOW_TYPE)
            .subscribe((res: GetDatasetFlowTriggersQuery) => {
                expect(res.datasets.byId?.flows.triggers.byType?.schedule?.__typename).toEqual(
                    "Cron5ComponentExpression",
                );
                expect(res.datasets.byId?.flows.triggers.byType?.paused).toEqual(
                    mockGetDatasetFlowTriggersQuery.datasets.byId?.flows.triggers.byType?.paused,
                );
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check setDatasetTriggers with success", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowTriggers").and.returnValue(of(mockSetDatasetFlowTriggerSuccess));
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        const subscription$ = service
            .setDatasetTriggers({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: MOCK_PAUSED,
                triggerInput: MOCK_TRIGGER_INPUT,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
                flush();
            });

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check setDatasetTriggers with error", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowTriggers").and.returnValue(of(mockSetDatasetFlowTriggersError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetTriggers({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: MOCK_PAUSED,
                triggerInput: MOCK_TRIGGER_INPUT,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    }));
});
