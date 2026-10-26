/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import {
    expectPageNotFoundRedirect,
    routeSnapshot,
    runResolver,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetNotFoundError } from "@common/values/errors";
import { DatasetPermissionsFragment } from "@api/kamu.graphql.interface";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { flowDetailsResolverFn } from "src/app/dataset-flow/dataset-flow-details/resolvers/flow-details.resolver";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("flowDetailsResolverFn", () => {
    const TEST_FLOW_ID = "test-flow-id";

    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowsService: DatasetFlowsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);

        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
    });

    function mockPermissions(permissions: DatasetPermissionsFragment = mockFullPowerDatasetPermissionsFragment): void {
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(of(permissions));
    }

    function resolve(): Promise<unknown> {
        const route = routeSnapshot({
            params: {
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                [ProjectLinks.URL_PARAM_FLOW_ID]: TEST_FLOW_ID,
            },
        });
        return runResolver(flowDetailsResolverFn, route);
    }

    it("should load the dataset from the route and resolve its flow", async () => {
        mockPermissions();
        const requestDatasetBasicDataWithPermissionsSpy = vi
            .spyOn(datasetService, "requestDatasetBasicDataWithPermissions")
            .mockReturnValue(of(undefined));
        const datasetFlowByIdSpy = vi
            .spyOn(datasetFlowsService, "datasetFlowById")
            .mockReturnValue(of(mockDatasetFlowByIdResponse));

        const data = await resolve();

        expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledTimes(1);

        expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(datasetFlowByIdSpy).toHaveBeenCalledTimes(1);
        expect(datasetFlowByIdSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            flowId: TEST_FLOW_ID,
        });
        expect(data).toEqual(mockDatasetFlowByIdResponse);
    });

    it("should redirect to page not found when the dataset has no such flow", async () => {
        mockPermissions();
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(of(undefined));
        vi.spyOn(datasetFlowsService, "datasetFlowById").mockReturnValue(of(undefined));

        const data = await resolve();

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found when the dataset does not exist", async () => {
        mockPermissions();
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(
            throwError(() => new DatasetNotFoundError()),
        );
        const datasetFlowByIdSpy = stubMethod(datasetFlowsService, "datasetFlowById");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
    });

    it("should redirect to page not found without loading the flow when the user may not view flows", async () => {
        mockPermissions(mockReadonlyDatasetPermissionsFragment);
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(of(undefined));
        const datasetFlowByIdSpy = stubMethod(datasetFlowsService, "datasetFlowById");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
    });

    it("should propagate other errors from loading the dataset", async () => {
        mockPermissions();
        const errorMessage = "Failed to fetch dataset permissions";
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(
            throwError(() => new Error(errorMessage)),
        );
        const datasetFlowByIdSpy = stubMethod(datasetFlowsService, "datasetFlowById");

        await expect(resolve()).rejects.toThrowError(errorMessage);
        expect(datasetFlowByIdSpy).not.toHaveBeenCalled();
    });

    it("should propagate errors from loading the flow", async () => {
        mockPermissions();
        const errorMessage = "Failed to fetch flow details";
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(of(undefined));
        vi.spyOn(datasetFlowsService, "datasetFlowById").mockReturnValue(throwError(() => new Error(errorMessage)));

        await expect(resolve()).rejects.toThrowError(errorMessage);
    });
});
