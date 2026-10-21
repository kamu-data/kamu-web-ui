/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { datasetViewResolverFn } from "src/app/dataset-view/resolvers/dataset-view.resolver";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetViewResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;

    const routeSnapshot = {
        paramMap: convertToParamMap({
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
        }),
        queryParamMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;
    const mockState = {
        url: `/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}/${DatasetViewTypeEnum.Overview}`,
    } as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetViewData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetViewResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
    });

    it("should request the dataset from the route and resolve it with permissions", async () => {
        const requestDatasetMainDataSpy = spyOn(datasetService, "requestDatasetMainData").and.returnValue(of(void 0));

        const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<DatasetViewData>);

        expect(requestDatasetMainDataSpy).toHaveBeenCalledOnceWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
    });

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        spyOn(datasetService, "requestDatasetMainData").and.returnValue(throwError(() => new Error("failed")));

        const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);

        expectPageNotFoundRedirect(data);
    });
});
