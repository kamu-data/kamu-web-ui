/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { metadataLicenseTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-license-tab/resolvers/metadata-license-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("metadataLicenseTabResolver", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataLicenseTabResolverFn(...resolverParameters));

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
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>;
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
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        (executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>).subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
