/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetSettingsTransformTabResolver } from "./dataset-settings-transform-tab.resolver";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { Apollo } from "apollo-angular";
import { of, Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import AppValues from "src/app/common/values/app.values";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("datasetSettingsTransformTabResolver", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let appConfigService: AppConfigService;

    const executeResolver: ResolveFn<DatasetBasicsFragment | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsTransformTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        appConfigService = TestBed.inject(AppConfigService);
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", () => {
        const cloneDataUpdate = structuredClone(mockOverviewUpdate);
        cloneDataUpdate.overview.metadata.currentTransform = {
            __typename: "SetTransform",
        };
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(cloneDataUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        const mockRoute = {} as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/${SettingsTabsEnum.TRANSFORM_SETTINGS}`,
        } as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetBasicsFragment>;
        result.subscribe((data) => {
            expect(data).toEqual(mockDatasetBasicsDerivedFragment);
        });
    });

    it("should check resolver with wrong tab", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        const mockRoute = {} as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/wrongTab`,
        } as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetBasicsFragment>;
        result.subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
