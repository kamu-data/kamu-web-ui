/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr, ToastrService } from "ngx-toastr";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetFlowApi } from "@api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowConfigCompactionInput,
    FlowConfigIngestInput,
    GetDatasetFlowConfigsQuery,
} from "@api/kamu.graphql.interface";
import {
    mockIngestGetDatasetFlowConfigsSuccess,
    mockRetryPolicyInput,
    mockSetCompactionFlowConfigMutation,
    mockSetCompactionFlowConfigMutationError,
    mockSetIngestFlowConfigMutation,
    mockSetIngestFlowConfigMutationError,
} from "@api/mock/dataset-flow.mock";

import { DatasetFlowConfigService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-config.service";

describe("DatasetFlowConfigService", () => {
    let service: DatasetFlowConfigService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;

    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";

    const MOCK_INGEST_INPUT: FlowConfigIngestInput = {
        fetchUncacheable: true,
        fetchNextIteration: false,
    };

    const MOCK_COMPACTION_INPUT: FlowConfigCompactionInput = {
        maxSliceRecords: 10,
        maxSliceSize: 1000,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetFlowConfigService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check setDatasetFlowIngestConfig with success", () => {
        vi.spyOn(datasetFlowApi, "setDatasetFlowIngestConfig").mockReturnValue(of(mockSetIngestFlowConfigMutation));
        const subscription$ = service
            .setDatasetIngestFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                ingestConfigInput: MOCK_INGEST_INPUT,
                retryPolicyInput: mockRetryPolicyInput,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check setDatasetFlowIngestConfig with error", () => {
        vi.spyOn(datasetFlowApi, "setDatasetFlowIngestConfig").mockReturnValue(
            of(mockSetIngestFlowConfigMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");
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

        expect(subscription$.closed).toBe(true);
    });

    it("should check setDatasetFlowCompactionConfig with success", () => {
        vi.spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").mockReturnValue(
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

        expect(subscription$.closed).toBe(true);
    });

    it("should check setCompactionFlowConfigs with error", () => {
        vi.spyOn(datasetFlowApi, "setDatasetFlowCompactionConfig").mockReturnValue(
            of(mockSetCompactionFlowConfigMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");
        const subscription$ = service
            .setDatasetCompactionFlowConfigs({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: MOCK_COMPACTION_INPUT,
            })
            .subscribe((res: boolean) => {
                expect(res).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check fetchDatasetFlowConfigs method", () => {
        vi.spyOn(datasetFlowApi, "getDatasetFlowConfigs").mockReturnValue(of(mockIngestGetDatasetFlowConfigsSuccess));
        const subscription$ = service
            .fetchDatasetFlowConfigs(MOCK_DATASET_ID, DatasetFlowType.HardCompaction)
            .subscribe((res: GetDatasetFlowConfigsQuery) => {
                expect(res.datasets.byId?.flows.configs.byType?.rule?.__typename).toEqual("FlowConfigRuleIngest");
                expect(
                    mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType?.rule?.__typename,
                ).toEqual("FlowConfigRuleIngest");

                expect(res.datasets.byId?.flows.configs.byType?.rule).toEqual(
                    mockIngestGetDatasetFlowConfigsSuccess.datasets.byId?.flows.configs.byType?.rule,
                );
            });

        expect(subscription$.closed).toBe(true);
    });
});
