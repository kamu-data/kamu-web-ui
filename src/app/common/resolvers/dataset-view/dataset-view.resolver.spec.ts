/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetViewResolver } from "./dataset-view.resolver";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";
import { Observable, of, Subject, throwError } from "rxjs";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("datasetViewResolver", () => {
    let datasetService: DatasetService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<DatasetViewData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetViewResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const mockObservable = new Subject<void>();
        const requestDatasetMainDataSpy = spyOn(datasetService, "requestDatasetMainData").and.returnValue(
            mockObservable,
        );
        const routeSnapshot = {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            }),

            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${DatasetViewTypeEnum.Overview}`,
        } as RouterStateSnapshot;

        await executeResolver(routeSnapshot, mockState);
        expect(requestDatasetMainDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resolver with error", () => {
        const requestDatasetMainDataSpy = spyOn(datasetService, "requestDatasetMainData").and.returnValue(
            throwError(() => new Error("failed")),
        );
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        const routeSnapshot = {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            }),

            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${DatasetViewTypeEnum.Overview}`,
        } as RouterStateSnapshot;

        (executeResolver(routeSnapshot, mockState) as Observable<DatasetViewData>).subscribe({
            complete: () => {
                expect(requestDatasetMainDataSpy).toHaveBeenCalledTimes(1);
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
