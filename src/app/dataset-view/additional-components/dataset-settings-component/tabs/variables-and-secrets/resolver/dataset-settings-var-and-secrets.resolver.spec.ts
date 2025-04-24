/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetSettingsVarAndSecretsResolverFn } from "./dataset-settings-var-and-secrets.resolver";
import { AppConfigService } from "src/app/app-config.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";
import { of } from "rxjs";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import AppValues from "src/app/common/values/app.values";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

describe("datasetSettingsVarAndSecretsResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let appConfigService: AppConfigService;

    const executeResolver: ResolveFn<DatasetViewData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsVarAndSecretsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
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

    it("should check resolver with error", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        const routeSnapshot = {
            parent: {
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/wrongTab`,
        } as RouterStateSnapshot;

        executeResolver(routeSnapshot, mockState) as DatasetViewData;
        expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resolver ", () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        const routeSnapshot = {
            parent: {
                parent: {
                    paramMap: convertToParamMap({
                        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                        [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                    }),
                },
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/${SettingsTabsEnum.VARIABLES_AND_SECRETS}`,
        } as RouterStateSnapshot;

        const result = executeResolver(routeSnapshot, mockState) as DatasetViewData;
        expect(result).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
    });
});
