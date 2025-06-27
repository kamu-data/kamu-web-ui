/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetCompactionService } from "./dataset-compaction.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import {
    mockDatasetTriggerResetFlowMutation,
    mockDatasetTriggerResetFlowMutationError,
} from "src/app/api/mock/dataset-flow.mock";
import { TEST_ACCOUNT_ID } from "src/app/search/mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("DatasetCompactionService", () => {
    let service: DatasetCompactionService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    let flowsService: DatasetFlowsService;
    const MOCK_SLICE_SIZE = 10 * Math.pow(2, 10);
    const MOCK_SLICE_RECORDS = 100000;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
        });
        service = TestBed.inject(DatasetCompactionService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
        flowsService = TestBed.inject(DatasetFlowsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check runHardCompaction with success", () => {
        spyOn(flowsService, "datasetTriggerCompactionFlow").and.returnValue(of(true));

        const subscription$ = service
            .runHardCompaction({
                datasetId: TEST_DATASET_ID,
                compactionArgs: {
                    full: {
                        maxSliceSize: MOCK_SLICE_SIZE,
                        maxSliceRecords: MOCK_SLICE_RECORDS,
                        recursive: true,
                    },
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBeTrue();
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check reset to Seed with success", () => {
        spyOn(datasetFlowApi, "datasetTriggerResetFlow").and.returnValue(of(mockDatasetTriggerResetFlowMutation));

        const subscription$ = service
            .resetToSeed({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                resetArgs: {
                    mode: {
                        toSeed: {},
                    },
                    recursive: true,
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBeTrue();
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check reset to Seed with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerResetFlow").and.returnValue(of(mockDatasetTriggerResetFlowMutationError));

        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const subscription$ = service
            .resetToSeed({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                resetArgs: {
                    mode: {
                        toSeed: {},
                    },
                    recursive: true,
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBeFalse();
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
