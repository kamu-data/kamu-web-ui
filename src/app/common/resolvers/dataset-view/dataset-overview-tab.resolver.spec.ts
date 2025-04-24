/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetOverviewTabResolverFn } from "./dataset-overview-tab.resolver";
import { Observable, throwError } from "rxjs";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { Apollo } from "apollo-angular";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("datasetOverviewTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetOverviewTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {
            parent: {
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = (await executeResolver(routeSnapshot, mockState)) as Observable<DatasetOverviewTabData>;
        result.subscribe((data: DatasetOverviewTabData) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: mockOverviewUpdate,
            });
        });
    });

    it("should check resolver with error", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(throwError(() => new Error("fail")));
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {
            parent: {
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        (executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>).subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
