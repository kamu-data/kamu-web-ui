/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AppConfigService } from "src/app/app-config.service";
import AppValues from "src/app/common/values/app.values";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { datasetSettingsVarAndSecretsResolverFn } from "./dataset-settings-var-and-secrets.resolver";

describe("datasetSettingsVarAndSecretsResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let appConfigService: AppConfigService;

    const executeResolver: ResolveFn<DatasetViewData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsVarAndSecretsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
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
        const mockRoute = {
            data: {
                [ProjectLinks.URL_PARAM_TAB]: "wrongTab",
            },
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetViewData>;
        result.subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });

    it("should check resolver ", () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        const mockRoute = {
            data: {
                [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.VARIABLES_AND_SECRETS,
            },
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetViewData>;
        result.subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });
    });
});
