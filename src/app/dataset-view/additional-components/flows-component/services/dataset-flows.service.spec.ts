/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetFlowApi } from "@api/dataset-flow.api";
import { AccountFragment, DatasetFlowProcessesDataFragment } from "@api/kamu.graphql.interface";
import {
    mockCancelFlowRunMutationError,
    mockCancelFlowRunMutationSuccess,
    mockDatasetFlowInitiators,
    mockDatasetFlowsInitiatorsQuery,
    mockDatasetFlowsProcessesQuery,
    mockDatasetPauseFlowsMutationError,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationError,
    mockDatasetResumeFlowsMutationSuccess,
    mockDatasetTriggerCompactionFlowMutation,
    mockDatasetTriggerCompactionFlowMutationError,
    mockDatasetTriggerIngestFlowMutation,
    mockDatasetTriggerIngestFlowMutationError,
    mockDatasetTriggerResetFlowMutation,
    mockDatasetTriggerResetFlowMutationError,
    mockDatasetTriggerResetToMetadataFlowMutation,
    mockDatasetTriggerResetToMetadataFlowMutationError,
    mockDatasetTriggerTransformFlowMutation,
    mockDatasetTriggerTransformFlowMutationError,
    mockGetDatasetListFlowsQuery,
    mockGetFlowByIdQueryError,
    mockGetFlowByIdQuerySuccess,
} from "@api/mock/dataset-flow.mock";
import { MaybeUndefined } from "@interface/app.types";

import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";

describe("DatasetFlowsService", () => {
    let service: DatasetFlowsService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;

    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";
    const MOCK_PAGE = 1;
    const MOCK_PER_PAGE = 15;
    const MOCK_FILTERS = {};
    const MOCK_FLOW_ID = "10";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DatasetFlowsService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get flows prcosses", () => {
        vi.spyOn(datasetFlowApi, "getDatasetFlowsProcesses").mockReturnValue(of(mockDatasetFlowsProcessesQuery));
        const subscription$ = service
            .datasetFlowsProcesses({
                datasetId: MOCK_DATASET_ID,
            })
            .subscribe((data: DatasetFlowProcessesDataFragment) => {
                expect(data).toEqual(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes));
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check get dataset flows list", () => {
        vi.spyOn(datasetFlowApi, "getDatasetListFlows").mockReturnValue(of(mockGetDatasetListFlowsQuery));

        const subscription$ = service
            .datasetFlowsList({
                datasetId: MOCK_DATASET_ID,
                page: MOCK_PAGE,
                perPageTable: MOCK_PER_PAGE,
                perPageTiles: MOCK_PER_PAGE,
                filters: MOCK_FILTERS,
            })
            .subscribe((data: MaybeUndefined<FlowsTableData>) => {
                expect(data?.connectionDataForTable.nodes).toEqual(
                    mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.table.nodes,
                );
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should paused all flows with success", () => {
        vi.spyOn(datasetFlowApi, "datasetPauseFlows").mockReturnValue(of(mockDatasetPauseFlowsMutationSuccess));
        const toastrServiceSuccessSpy = stubMethod(toastService, "success");

        const subscription$ = service.datasetPauseFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows paused");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should paused all flows with error", () => {
        vi.spyOn(datasetFlowApi, "datasetPauseFlows").mockReturnValue(of(mockDatasetPauseFlowsMutationError));
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service.datasetPauseFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not paused");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should resumed all flows with success", () => {
        vi.spyOn(datasetFlowApi, "datasetResumeFlows").mockReturnValue(of(mockDatasetResumeFlowsMutationSuccess));
        const toastrServiceSuccessSpy = stubMethod(toastService, "success");

        const subscription$ = service.datasetResumeFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows resumed");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should resumed all flows with error", () => {
        vi.spyOn(datasetFlowApi, "datasetResumeFlows").mockReturnValue(of(mockDatasetResumeFlowsMutationError));
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service.datasetResumeFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not resumed");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset ingest flow", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerIngestFlow").mockReturnValue(of(mockDatasetTriggerIngestFlowMutation));

        const subscription$ = service
            .datasetTriggerIngestFlow({ datasetId: MOCK_DATASET_ID })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset ingest flow with error", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerIngestFlow").mockReturnValue(
            of(mockDatasetTriggerIngestFlowMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service.datasetTriggerIngestFlow({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset transform flow", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerTransformFlow").mockReturnValue(
            of(mockDatasetTriggerTransformFlowMutation),
        );

        const subscription$ = service
            .datasetTriggerTransformFlow({ datasetId: MOCK_DATASET_ID })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset transform flow with error", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerTransformFlow").mockReturnValue(
            of(mockDatasetTriggerTransformFlowMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service.datasetTriggerTransformFlow({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset compaction flow", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerCompactionFlow").mockReturnValue(
            of(mockDatasetTriggerCompactionFlowMutation),
        );

        const subscription$ = service
            .datasetTriggerCompactionFlow({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: {
                    maxSliceRecords: 10000,
                    maxSliceSize: 3000000,
                },
            })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset compaction flow with error", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerCompactionFlow").mockReturnValue(
            of(mockDatasetTriggerCompactionFlowMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service
            .datasetTriggerCompactionFlow({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: { maxSliceRecords: 1000, maxSliceSize: 10000 },
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset reset flow", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerResetFlow").mockReturnValue(of(mockDatasetTriggerResetFlowMutation));

        const subscription$ = service
            .datasetTriggerResetFlow({
                datasetId: MOCK_DATASET_ID,
                resetConfigInput: { mode: { toSeed: {} } },
            })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset reset flow with error", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerResetFlow").mockReturnValue(
            of(mockDatasetTriggerResetFlowMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service
            .datasetTriggerResetFlow({
                datasetId: MOCK_DATASET_ID,
                resetConfigInput: {
                    mode: { custom: { newHeadHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX" } },
                },
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset reset to metadata flow", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerResetToMetadataFlow").mockReturnValue(
            of(mockDatasetTriggerResetToMetadataFlowMutation),
        );

        const subscription$ = service
            .datasetTriggerResetToMetadataFlow({
                datasetId: MOCK_DATASET_ID,
            })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check trigger dataset reset to metadata flow with error", () => {
        vi.spyOn(datasetFlowApi, "datasetTriggerResetToMetadataFlow").mockReturnValue(
            of(mockDatasetTriggerResetToMetadataFlowMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service
            .datasetTriggerResetToMetadataFlow({
                datasetId: MOCK_DATASET_ID,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check cancel flow", () => {
        vi.spyOn(datasetFlowApi, "cancelFlowRun").mockReturnValue(of(mockCancelFlowRunMutationSuccess));

        const subscription$ = service
            .cancelFlowRun({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check cancel flow with error", () => {
        vi.spyOn(datasetFlowApi, "cancelFlowRun").mockReturnValue(of(mockCancelFlowRunMutationError));
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const subscription$ = service
            .cancelFlowRun({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(
                    mockCancelFlowRunMutationError.datasets.byId?.flows.runs.cancelFlowRun.message,
                );
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check get flow by id with success", async () => {
        vi.spyOn(datasetFlowApi, "getFlowById").mockReturnValue(of(mockGetFlowByIdQuerySuccess));

        const result = await firstValueFrom(
            service.datasetFlowById({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID }),
        );

        expect(result?.flow.flowId).toEqual("595");
    });

    it("should resolve an unknown flow to undefined without a toast", async () => {
        vi.spyOn(datasetFlowApi, "getFlowById").mockReturnValue(of(mockGetFlowByIdQueryError));
        const toastrServiceErrorSpy = stubMethod(toastService, "error");

        const result = await firstValueFrom(
            service.datasetFlowById({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID }),
        );

        expect(result).toBeUndefined();
        expect(toastrServiceErrorSpy).not.toHaveBeenCalled();
    });

    it("should check flows initiators", () => {
        vi.spyOn(datasetFlowApi, "getDatasetFlowsInitiators").mockReturnValue(of(mockDatasetFlowsInitiatorsQuery));

        const initiatorsBefore = [...mockDatasetFlowInitiators];

        const subscription$ = service.flowsInitiators(MOCK_DATASET_ID).subscribe((data: AccountFragment[]) => {
            expect(data.map((initiator) => initiator.accountName)).toEqual(["bamu", "kamu", "kamu"]);
        });

        expect(subscription$.closed).toBe(true);
        expect(mockDatasetFlowInitiators).toEqual(initiatorsBefore);
    });
});
