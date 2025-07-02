/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetSettingsWebhooksResolverFn } from "./dataset-settings-webhooks.resolver";
import { AppConfigService } from "src/app/app-config.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import AppValues from "src/app/common/values/app.values";
import { of, Observable } from "rxjs";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { SettingsTabsEnum } from "../../../dataset-settings.model";
import { DatasetWebhooksService } from "../service/dataset-webhooks.service";
import { DatasetSettingsWebhookTabData } from "../dataset-settings-webhooks-tab.component.types";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("datasetSettingsWebhooksResolver", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let appConfigService: AppConfigService;
    let datasetWebhooksService: DatasetWebhooksService;

    const executeResolver: ResolveFn<DatasetSettingsWebhookTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsWebhooksResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        appConfigService = TestBed.inject(AppConfigService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(of([]));
        const mockRoute = {
            data: {
                [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.WEBHOOKS,
            },
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetSettingsWebhookTabData>;
        result.subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                subscriptions: [],
            });
        });
    });

    it("should check resolver with wrong tab", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(of([]));
        const mockRoute = {
            data: {
                [ProjectLinks.URL_PARAM_TAB]: "wrongTab",
            },
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetSettingsWebhookTabData>;
        result.subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
