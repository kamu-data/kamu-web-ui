import { TestBed } from "@angular/core/testing";
import { DatasetFlowsService } from "./dataset-flows.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockCancelScheduledTasksMutationError,
    mockCancelScheduledTasksMutationSuccess,
    mockDatasetAllFlowsPausedQuery,
    mockDatasetPauseFlowsMutationError,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationError,
    mockDatasetResumeFlowsMutationSuccess,
    mockDatasetTriggerFlowMutation,
    mockDatasetTriggerFlowMutationError,
    mockGetDatasetListFlowsQuery,
    mockGetFlowByIdQueryError,
    mockGetFlowByIdQuerySuccess,
} from "src/app/api/mock/dataset-flow.mock";
import { MaybeUndefined } from "src/app/common/app.types";
import { FlowsTableData } from "../components/flows-table/flows-table.types";
import { DatasetFlowType } from "src/app/api/kamu.graphql.interface";

describe("DatasetFlowsService", () => {
    let service: DatasetFlowsService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";
    const MOCK_PAGE = 1;
    const MOCK_PER_PAGE = 15;
    const MOCK_FILTERS = {};
    const MOCK_DATASET_FLOW_TYPE = DatasetFlowType.Ingest;
    const MOCK_FLOW_ID = "10";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
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
                perPage: MOCK_PER_PAGE,
                filters: MOCK_FILTERS,
            })
            .subscribe((data: MaybeUndefined<FlowsTableData>) => {
                expect(data?.connectionData).toEqual(mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.listFlows);
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

    it("should check trigger dataset flow", () => {
        spyOn(datasetFlowApi, "datasetTriggerFlow").and.returnValue(of(mockDatasetTriggerFlowMutation));

        const subscription$ = service
            .datasetTriggerFlow({ datasetId: MOCK_DATASET_ID, datasetFlowType: MOCK_DATASET_FLOW_TYPE })
            .subscribe((result: boolean) => {
                expect(result).toBe(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check trigger dataset flow with error", () => {
        spyOn(datasetFlowApi, "datasetTriggerFlow").and.returnValue(of(mockDatasetTriggerFlowMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .datasetTriggerFlow({ datasetId: MOCK_DATASET_ID, datasetFlowType: MOCK_DATASET_FLOW_TYPE })
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
            expect(result).toEqual(mockDatasetAllFlowsPausedQuery.datasets.byId?.flows.configs.allPaused);
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check get flow by id", () => {
        spyOn(datasetFlowApi, "allFlowsPaused").and.returnValue(of(mockDatasetAllFlowsPausedQuery));

        const subscription$ = service.allFlowsPaused(MOCK_DATASET_ID).subscribe((result) => {
            expect(result).toEqual(mockDatasetAllFlowsPausedQuery.datasets.byId?.flows.configs.allPaused);
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
});
