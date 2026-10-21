/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import { DatasetNotFoundError } from "@common/values/errors";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { MaybeNull } from "@interface/app.types";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { flowDetailsResolverFn } from "src/app/dataset-flow/dataset-flow-details/resolvers/flow-details.resolver";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("flowDetailsResolverFn", () => {
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const TEST_FLOW_ID = "test-flow-id";

    let datasetService: DatasetService;
    let datasetFlowsService: DatasetFlowsService;

    const executeResolver: ResolveFn<MaybeNull<DatasetFlowByIdResponse>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);

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

    function resolve(mockRoute: ActivatedRouteSnapshot = createMockRoute()): Promise<unknown> {
        return firstValueFrom(executeResolver(mockRoute, mockRouterStateSnapshot) as Observable<unknown>);
    }

    it("should call services with correct parameters and return flow data", async () => {
        const requestDatasetBasicDataWithPermissionsSpy = spyOn(
            datasetService,
            "requestDatasetBasicDataWithPermissions",
        ).and.returnValue(of(undefined));
        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
            of(mockDatasetFlowByIdResponse),
        );

        const data = await resolve();

        expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledOnceWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(datasetFlowByIdSpy).toHaveBeenCalledOnceWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            flowId: TEST_FLOW_ID,
        });
        expect(data).toEqual(mockDatasetFlowByIdResponse);
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
            it(`when ${description}`, async () => {
                const requestDatasetBasicDataWithPermissionsSpy = spyOn(
                    datasetService,
                    "requestDatasetBasicDataWithPermissions",
                ).and.returnValue(of(undefined));
                const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
                    of(mockDatasetFlowByIdResponse),
                );

                const data = await resolve(createMockRoute(accountName, datasetName, flowId));

                expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledOnceWith({
                    accountName,
                    datasetName,
                });
                expect(datasetFlowByIdSpy).toHaveBeenCalledOnceWith({
                    datasetId: mockDatasetBasicsRootFragment.id,
                    flowId,
                });
                expect(data).toEqual(mockDatasetFlowByIdResponse);
            });
        });
    });

    it("should redirect to page not found when the dataset does not exist", async () => {
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(
            throwError(() => new DatasetNotFoundError()),
        );
        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.stub();

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
    });

    it("should handle errors from requestDatasetBasicDataWithPermissions", async () => {
        const errorMessage = "Failed to fetch dataset permissions";
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(
            throwError(() => new Error(errorMessage)),
        );
        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.stub();

        await expectAsync(resolve()).toBeRejectedWithError(errorMessage);
        expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
    });

    it("should handle errors from datasetFlowById", async () => {
        const errorMessage = "Failed to fetch flow details";
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(of(undefined));
        spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(throwError(() => new Error(errorMessage)));

        await expectAsync(resolve()).toBeRejectedWithError(errorMessage);
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
            it(`when ${description}`, async () => {
                const requestDatasetBasicDataWithPermissionsSpy = spyOn(
                    datasetService,
                    "requestDatasetBasicDataWithPermissions",
                ).and.returnValue(of(undefined));
                const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
                    of(mockDatasetFlowByIdResponse),
                );

                const data = await resolve({ paramMap } as ActivatedRouteSnapshot);

                expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledTimes(1);
                expect(datasetFlowByIdSpy).toHaveBeenCalledTimes(1);
                expect(data).toEqual(mockDatasetFlowByIdResponse);
            });
        });
    });
});
