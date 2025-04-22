/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetSettingsVarAndSecretsResolver } from "./dataset-settings-var-and-secrets.resolver";
import { VariablesAndSecretsData } from "src/app/dataset-view/dataset-view.interface";
import { AppConfigService } from "src/app/app-config.service";
import { DatasetEvnironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-evnironment-variables.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";
import { Observable, of } from "rxjs";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import AppValues from "src/app/common/values/app.values";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";

describe("datasetSettingsVarAndSecretsResolver", () => {
    let evnironmentVariablesService: DatasetEvnironmentVariablesService;
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let appConfigService: AppConfigService;

    const executeResolver: ResolveFn<VariablesAndSecretsData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsVarAndSecretsResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
        evnironmentVariablesService = TestBed.inject(DatasetEvnironmentVariablesService);
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
        spyOn(evnironmentVariablesService, "listEnvVariables").and.returnValue(of());
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

        const result = executeResolver(routeSnapshot, mockState) as Observable<VariablesAndSecretsData>;
        result.subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });

    it("should check resolver ", () => {
        const listEnvVariablesSpy = spyOn(evnironmentVariablesService, "listEnvVariables").and.returnValue(of());
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

        const result = executeResolver(routeSnapshot, mockState) as Observable<VariablesAndSecretsData>;
        result.subscribe({
            complete: () => {
                expect(listEnvVariablesSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
