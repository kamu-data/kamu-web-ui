/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { metadataPushSourcesTabResolverFn } from "./metadata-push-sources-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { Observable } from "rxjs";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";

describe("metadataPushSourcesTabComponentResolver", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<DatasetOverviewTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataPushSourcesTabResolverFn(...resolverParameters));

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
        const cloneMockOverviewUpdate = structuredClone(mockOverviewUpdate);
        cloneMockOverviewUpdate.overview.metadata.currentPollingSource = null;
        cloneMockOverviewUpdate.overview.metadata.currentPushSources = [];
        datasetSubsService.emitOverviewChanged(cloneMockOverviewUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>;
        result.subscribe((data: DatasetOverviewTabData) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: cloneMockOverviewUpdate,
            });
        });
    });

    it("should check to redirect to 'page-not-found' route", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitOverviewChanged(structuredClone(mockOverviewUpdate));
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(routeSnapshot, mockState) as Observable<DatasetOverviewTabData>;
        result.subscribe(() => {
            expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
        });
    });
});
