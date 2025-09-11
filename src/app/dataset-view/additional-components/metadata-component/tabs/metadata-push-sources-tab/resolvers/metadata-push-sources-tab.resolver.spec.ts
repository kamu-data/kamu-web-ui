/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { metadataPushSourcesTabResolverFn } from "./metadata-push-sources-tab.resolver";
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
import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabData } from "../../../metadata.constants";

describe("metadataPushSourcesTabComponentResolver", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<MetadataTabData | null> = (...resolverParameters) =>
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
        const cloneMockMetadataRootUpdate = structuredClone(mockMetadataRootUpdate);
        cloneMockMetadataRootUpdate.metadataSummary.metadata.currentPollingSource = null;
        cloneMockMetadataRootUpdate.metadataSummary.metadata.currentPushSources = [];
        datasetSubsService.emitMetadataSchemaChanged(cloneMockMetadataRootUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<MetadataTabData>;
        result.subscribe((data: MetadataTabData) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                metadataSummary: cloneMockMetadataRootUpdate.metadataSummary,
            });
        });
    });

    it("should check to redirect to 'page-not-found' route", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitMetadataSchemaChanged(mockMetadataRootUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(routeSnapshot, mockState) as Observable<MetadataTabData>;
        result.subscribe(() => {
            expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
        });
    });
});
