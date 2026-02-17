/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable } from "rxjs";

import { Apollo } from "apollo-angular";

import { MaybeNull } from "@interface/app.types";

import {
    mockMetadataDerivedUpdate,
    mockMetadataRootUpdate,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { metadataPollingSourceTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/resolvers/metadata-polling-source-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("metadataPollingSourceTabResolver", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    const executeResolver: ResolveFn<MaybeNull<MetadataTabData>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataPollingSourceTabResolverFn(...resolverParameters));

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
        datasetSubsService.emitMetadataSchemaChanged(mockMetadataRootUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<MetadataTabData>;
        result.subscribe((data: MetadataTabData) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                metadataSummary: mockMetadataRootUpdate.metadataSummary,
            });
        });
    });

    it("should check to navigate to 'page-not-found' route", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitMetadataSchemaChanged(mockMetadataDerivedUpdate);
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as Observable<MetadataTabData>;
        result.subscribe(() => {
            expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
        });
    });
});
