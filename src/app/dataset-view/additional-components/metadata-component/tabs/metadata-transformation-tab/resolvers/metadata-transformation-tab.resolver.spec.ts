/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { metadataTransformationTabResolverFn } from "./metadata-transformation-tab.resolver";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { Observable } from "rxjs";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("metadataTransformationTabResolver", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<MaybeNullOrUndefined<DatasetOverviewTabData | null>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataTransformationTabResolverFn(...resolverParameters));

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

    it("should check resolver", () => {
        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>;
        result.subscribe((data: DatasetOverviewTabData) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsDerivedFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: mockOverviewUpdate,
            });
        });
    });

    it("should check to navigate to 'page-not-found' route", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>;
        result.subscribe(() => {
            expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
        });
    });
});
