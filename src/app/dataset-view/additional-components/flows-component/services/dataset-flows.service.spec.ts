/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetFlowsService } from "./dataset-flows.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockCancelScheduledTasksMutationError,
    mockCancelScheduledTasksMutationSuccess,
    mockDatasetAllFlowsPausedQuery,
    mockDatasetFlowsInitiatorsQuery,
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
    mockDatasetTriggerTransformFlowMutation,
    mockDatasetTriggerTransformFlowMutationError,
    mockGetDatasetListFlowsQuery,
    mockGetFlowByIdQueryError,
    mockGetFlowByIdQuerySuccess,
} from "src/app/api/mock/dataset-flow.mock";
import { MaybeUndefined } from "src/app/interface/app.types";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

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
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [ApolloTestingModule, HttpClientTestingModule],
        });
        service = TestBed.inject(DatasetFlowsService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get dataset flows list", () => {
        spyOn(datasetFlowApi, "getDatasetListFlows").and.returnValue(of(mockGetDatasetListFlowsQuery));

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

        expect(subscription$.closed).toBeTrue();
    });

    it("should paused all flows with success", () => {
        spyOn(datasetFlowApi, "datasetPauseFlows").and.returnValue(of(mockDatasetPauseFlowsMutationSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service.datasetPauseFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows paused");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should paused all flows with error", () => {
        spyOn(datasetFlowApi, "datasetPauseFlows").and.returnValue(of(mockDatasetPauseFlowsMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.datasetPauseFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not paused");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should resumed all flows with success", () => {
        spyOn(datasetFlowApi, "datasetResumeFlows").and.returnValue(of(mockDatasetResumeFlowsMutationSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service.datasetResumeFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows resumed");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should resumed all flows with error", () => {
        spyOn(datasetFlowApi, "datasetResumeFlows").and.returnValue(of(mockDatasetResumeFlowsMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.datasetResumeFlows({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not resumed");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset ingest flow", () => {
        spyOn(datasetFlowApi, "datasetTriggerIngestFlow").and.returnValue(of(mockDatasetTriggerIngestFlowMutation));

        const subscription$ = service
            .datasetTriggerIngestFlow({ datasetId: MOCK_DATASET_ID })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset ingest flow with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerIngestFlow").and.returnValue(
            of(mockDatasetTriggerIngestFlowMutationError),
        );
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.datasetTriggerIngestFlow({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset transform flow", () => {
        spyOn(datasetFlowApi, "datasetTriggerTransformFlow").and.returnValue(
            of(mockDatasetTriggerTransformFlowMutation),
        );

        const subscription$ = service
            .datasetTriggerTransformFlow({ datasetId: MOCK_DATASET_ID })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset transform flow with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerTransformFlow").and.returnValue(
            of(mockDatasetTriggerTransformFlowMutationError),
        );
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.datasetTriggerTransformFlow({ datasetId: MOCK_DATASET_ID }).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset compaction flow", () => {
        spyOn(datasetFlowApi, "datasetTriggerCompactionFlow").and.returnValue(
            of(mockDatasetTriggerCompactionFlowMutation),
        );

        const subscription$ = service
            .datasetTriggerCompactionFlow({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: { metadataOnly: { recursive: true } },
            })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset compaction flow with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerCompactionFlow").and.returnValue(
            of(mockDatasetTriggerCompactionFlowMutationError),
        );
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .datasetTriggerCompactionFlow({
                datasetId: MOCK_DATASET_ID,
                compactionConfigInput: { full: { recursive: true, maxSliceRecords: 1000, maxSliceSize: 10000 } },
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset reset flow", () => {
        spyOn(datasetFlowApi, "datasetTriggerResetFlow").and.returnValue(of(mockDatasetTriggerResetFlowMutation));

        const subscription$ = service
            .datasetTriggerResetFlow({
                datasetId: MOCK_DATASET_ID,
                resetConfigInput: { mode: { toSeed: {} }, recursive: false },
            })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset reset flow with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerResetFlow").and.returnValue(of(mockDatasetTriggerResetFlowMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .datasetTriggerResetFlow({
                datasetId: MOCK_DATASET_ID,
                resetConfigInput: {
                    recursive: false,
                    mode: { custom: { newHeadHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX" } },
                },
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error");
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check cancel scheduled tasks", () => {
        spyOn(datasetFlowApi, "cancelScheduledTasks").and.returnValue(of(mockCancelScheduledTasksMutationSuccess));

        const subscription$ = service
            .cancelScheduledTasks({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check cancel scheduled tasks with error", () => {
        spyOn(datasetFlowApi, "cancelScheduledTasks").and.returnValue(of(mockCancelScheduledTasksMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .cancelScheduledTasks({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith(
                    mockCancelScheduledTasksMutationError.datasets.byId?.flows.runs.cancelScheduledTasks.message,
                );
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check all flows paused", () => {
        spyOn(datasetFlowApi, "allFlowsPaused").and.returnValue(of(mockDatasetAllFlowsPausedQuery));

        const subscription$ = service.allFlowsPaused(MOCK_DATASET_ID).subscribe((result) => {
            expect(result).toEqual(mockDatasetAllFlowsPausedQuery.datasets.byId?.flows.triggers.allPaused);
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get flow by id with success", () => {
        spyOn(datasetFlowApi, "getFlowById").and.returnValue(of(mockGetFlowByIdQuerySuccess));
        const expectedFlowId = "595";
        const subscription$ = service
            .datasetFlowById({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe((result) => {
                expect(result?.flow.flowId).toEqual(expectedFlowId);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get flow by id with error", () => {
        spyOn(datasetFlowApi, "getFlowById").and.returnValue(of(mockGetFlowByIdQueryError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .datasetFlowById({ datasetId: MOCK_DATASET_ID, flowId: MOCK_FLOW_ID })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check flows initiators", () => {
        spyOn(datasetFlowApi, "getDatasetFlowsInitiators").and.returnValue(of(mockDatasetFlowsInitiatorsQuery));

        const subscription$ = service.flowsInitiators(MOCK_DATASET_ID).subscribe((data: AccountFragment[]) => {
            expect(data.length).toEqual(
                mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators.nodes.length as number,
            );
            expect(data[0].accountName).toEqual("bamu");
        });

        expect(subscription$.closed).toBeTrue();
    });
});
