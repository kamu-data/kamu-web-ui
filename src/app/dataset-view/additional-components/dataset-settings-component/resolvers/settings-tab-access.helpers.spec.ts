/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("resolveSettingsTabAccess", () => {
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
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
    });

    function resolve(permissions: DatasetPermissionsFragment): Promise<unknown> {
        vi.spyOn(datasetSubService, "permissionsChanges", "get").mockReturnValue(of(permissions));
        return firstValueFrom(TestBed.runInInjectionContext(() => resolveSettingsTabAccess(SettingsTabsEnum.GENERAL)));
    }

    it("should emit the dataset with its permissions when the tab is accessible", async () => {
        const data = await resolve(mockFullPowerDatasetPermissionsFragment);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
    });

    it("should redirect to page not found when the tab is not accessible", async () => {
        const data = await resolve(mockReadonlyDatasetPermissionsFragment);

        expectPageNotFoundRedirect(data);
    });
});
