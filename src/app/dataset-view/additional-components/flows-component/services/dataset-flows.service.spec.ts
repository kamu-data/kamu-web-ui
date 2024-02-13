import { TestBed } from "@angular/core/testing";
import { DatasetFlowsService } from "./dataset-flows.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import { of } from "rxjs";
import {
    mockDatasetPauseFlowsMutationError,
    mockDatasetPauseFlowsMutationSuccess,
    mockDatasetResumeFlowsMutationError,
    mockDatasetResumeFlowsMutationSuccess,
    mockGetDatasetListFlowsQuery,
} from "src/app/api/mock/dataset-flow.mock";
import { FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";

describe("DatasetFlowsService", () => {
    let service: DatasetFlowsService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";
    const MOCK_PAGE = 1;
    const MOCK_PER_PAGE = 15;
    const MOCK_FILTERS = {};

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
            .subscribe((data: MaybeUndefined<FlowConnectionDataFragment>) => {
                expect(data).toEqual(mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.listFlows);
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
});
