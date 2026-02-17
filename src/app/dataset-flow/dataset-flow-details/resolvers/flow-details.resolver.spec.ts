/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { first, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { mockDatasetFlowByIdResponse } from "src/app/api/mock/dataset-flow.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MaybeNull } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

import { flowDetailsResolverFn } from "./flow-details.resolver";

describe("flowDetailsResolverFn", () => {
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const TEST_FLOW_ID = "test-flow-id";

    let datasetService: DatasetService;
    let datasetFlowsService: DatasetFlowsService;

    const executeResolver: ResolveFn<MaybeNull<DatasetFlowByIdResponse>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsResolverFn(...resolverParameters));

    type ResolverObservable = Observable<MaybeNull<DatasetFlowByIdResponse>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Apollo,
                provideAnimations(),
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);

        // Setup default property spy for datasetChanges
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
    });

    function createMockRoute(
        accountName: string = TEST_ACCOUNT_NAME,
        datasetName: string = TEST_DATASET_NAME,
        flowId: string = TEST_FLOW_ID,
    ): ActivatedRouteSnapshot {
        return {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: accountName,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: datasetName,
                [ProjectLinks.URL_PARAM_FLOW_ID]: flowId,
            }),
        } as ActivatedRouteSnapshot;
    }

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should call services with correct parameters and return flow data", () => {
        const requestDatasetBasicDataWithPermissionsSpy = spyOn(
            datasetService,
            "requestDatasetBasicDataWithPermissions",
        ).and.returnValue(of(undefined));

        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
            of(mockDatasetFlowByIdResponse),
        );

        const mockRoute = createMockRoute();
        const resolver$ = executeResolver(mockRoute, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: MaybeNull<DatasetFlowByIdResponse>) => {
                expect(data).toEqual(mockDatasetFlowByIdResponse);
            });

        expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });

        expect(datasetFlowByIdSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            flowId: TEST_FLOW_ID,
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });

    describe("should handle different route parameters correctly", () => {
        const testCases = [
            {
                description: "different account name",
                accountName: "different-account",
                datasetName: TEST_DATASET_NAME,
                flowId: TEST_FLOW_ID,
            },
            {
                description: "different dataset name",
                accountName: TEST_ACCOUNT_NAME,
                datasetName: "different-dataset",
                flowId: TEST_FLOW_ID,
            },
            {
                description: "different flow ID",
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                flowId: "different-flow-id",
            },
        ];

        testCases.forEach(({ description, accountName, datasetName, flowId }) => {
            it(`when ${description}`, () => {
                const requestDatasetBasicDataWithPermissionsSpy = spyOn(
                    datasetService,
                    "requestDatasetBasicDataWithPermissions",
                ).and.returnValue(of(undefined));

                const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
                    of(mockDatasetFlowByIdResponse),
                );

                const mockRoute = createMockRoute(accountName, datasetName, flowId);
                const resolver$ = executeResolver(mockRoute, mockRouterStateSnapshot);

                const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe(() => {
                    expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledWith({
                        accountName,
                        datasetName,
                    });

                    expect(datasetFlowByIdSpy).toHaveBeenCalledWith({
                        datasetId: mockDatasetBasicsRootFragment.id,
                        flowId,
                    });
                });

                expect(resolverSubscription$.closed).toBeTrue();
            });
        });
    });

    it("should handle errors from requestDatasetBasicDataWithPermissions", () => {
        const errorMessage = "Failed to fetch dataset permissions";
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(
            throwError(() => new Error(errorMessage)),
        );

        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.stub();

        const mockRoute = createMockRoute();
        const resolver$ = executeResolver(mockRoute, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe({
            next: (data: MaybeNull<DatasetFlowByIdResponse>) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(errorMessage);
                expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should handle errors from datasetFlowById", () => {
        const errorMessage = "Failed to fetch flow details";
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(of(undefined));
        spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(throwError(() => new Error(errorMessage)));

        const mockRoute = createMockRoute();
        const resolver$ = executeResolver(mockRoute, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe({
            next: (data: MaybeNull<DatasetFlowByIdResponse>) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(errorMessage);
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });

    describe("should handle missing route parameters", () => {
        const testCases = [
            {
                description: "missing account name",
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                    [ProjectLinks.URL_PARAM_FLOW_ID]: TEST_FLOW_ID,
                }),
            },
            {
                description: "missing dataset name",
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_FLOW_ID]: TEST_FLOW_ID,
                }),
            },
            {
                description: "missing flow ID",
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
        ];

        testCases.forEach(({ description, paramMap }) => {
            it(`when ${description}`, () => {
                const requestDatasetBasicDataWithPermissionsSpy = spyOn(
                    datasetService,
                    "requestDatasetBasicDataWithPermissions",
                ).and.returnValue(of(undefined));

                const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
                    of(mockDatasetFlowByIdResponse),
                );

                const mockRoute = { paramMap } as ActivatedRouteSnapshot;
                const resolver$ = executeResolver(mockRoute, mockRouterStateSnapshot);

                const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe(() => {
                    expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledTimes(1);
                    expect(datasetFlowByIdSpy).toHaveBeenCalledTimes(1);
                });

                expect(resolverSubscription$.closed).toBeTrue();
            });
        });
    });
});
