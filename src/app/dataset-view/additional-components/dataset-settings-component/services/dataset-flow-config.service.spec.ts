/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockRetryPolicyInput,
    mockSetCompactionFlowConfigMutation,
    mockSetCompactionFlowConfigMutationError,
    mockSetIngestFlowConfigMutation,
    mockSetIngestFlowConfigMutationError,
} from "src/app/api/mock/dataset-flow.mock";
import {
    FlowConfigCompactionInput,
    GetDatasetFlowConfigsQuery,
    FlowConfigRuleIngest,
    DatasetFlowType,
    FlowConfigIngestInput,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowConfigService } from "./dataset-flow-config.service";

describe("DatasetFlowConfigService", () => {
    let service: DatasetFlowConfigService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;

    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";

    const MOCK_INGEST_INPUT: FlowConfigIngestInput = {
        fetchUncacheable: true,
    };

    const MOCK_COMPACTION_INPUT: FlowConfigCompactionInput = {
        full: {
            maxSliceRecords: 10,
            maxSliceSize: 1000,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetFlowConfigService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check setDatasetFlowIngestConfig with success", () => {
        spyOn(datasetFlowApi, "setDatasetFlowIngestConfig").and.returnValue(of(mockSetIngestFlowConfigMutation));
        const subscription$ = service
            .setDatasetIngestFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                ingestConfigInput: MOCK_INGEST_INPUT,
                retryPolicyInput: mockRetryPolicyInput,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check setDatasetFlowIngestConfig with error", () => {
        spyOn(datasetFlowApi, "setDatasetFlowIngestConfig").and.returnValue(of(mockSetIngestFlowConfigMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const subscription$ = service
            .setDatasetIngestFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                ingestConfigInput: MOCK_INGEST_INPUT,
                retryPolicyInput: null,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check setDatasetFlowCompactionConfig with success", () => {
        spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").and.returnValue(
            of(mockSetCompactionFlowConfigMutation),
        );
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

    it("should check setCompactionFlowConfigs with error", () => {
        spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").and.returnValue(
            of(mockSetCompactionFlowConfigMutationError),
        );
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
            .fetchDatasetFlowConfigs(MOCK_DATASET_ID, DatasetFlowType.HardCompaction)
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                expect(res.datasets.byId?.flows.configs.byType?.rule?.__typename).toEqual("FlowConfigRuleIngest");
                expect(
                    mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType?.rule?.__typename,
                ).toEqual("FlowConfigRuleIngest");

                const actualIngestRule = res.datasets.byId?.flows.configs.byType?.rule as FlowConfigRuleIngest;
                const expectedIngestRule = mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType
                    ?.rule as FlowConfigRuleIngest;
                expect(actualIngestRule.fetchUncacheable).toEqual(expectedIngestRule.fetchUncacheable);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
