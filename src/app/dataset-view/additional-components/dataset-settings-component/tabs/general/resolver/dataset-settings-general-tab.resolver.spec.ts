/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { datasetSettingsGeneralTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("datasetSettingsGeneralTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        appConfigService = TestBed.inject(AppConfigService);
        vi.spyOn(appConfigService, "featureFlags", "get").mockReturnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
    });

    function resolve(tab: string): Promise<DatasetViewData | RedirectCommand> {
        const route = routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: tab } });
        return runResolver(datasetSettingsGeneralTabResolverFn, route);
    }

    function mockDataset(permissions = mockFullPowerDatasetPermissionsFragment): void {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
        vi.spyOn(datasetSubService, "permissionsChanges", "get").mockReturnValue(of(permissions));
    }

    [
        SettingsTabsEnum.GENERAL,
        SettingsTabsEnum.ACCESS,
        SettingsTabsEnum.COMPACTION,
        SettingsTabsEnum.VARIABLES_AND_SECRETS,
    ].forEach((tab) => {
        it(`should resolve the dataset for the ${tab} tab`, async () => {
            mockDataset();

            const data = await resolve(tab);

            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });
    });

    it("should redirect to page not found for an unknown tab", async () => {
        mockDataset();

        const data = await resolve("wrongTab");

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found when the user may not change the dataset", async () => {
        mockDataset(mockReadonlyDatasetPermissionsFragment);

        const data = await resolve(SettingsTabsEnum.GENERAL);

        expectPageNotFoundRedirect(data);
    });
});
