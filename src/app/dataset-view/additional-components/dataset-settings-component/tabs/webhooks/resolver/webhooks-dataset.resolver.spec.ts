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
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect, runResolver } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { webhooksDatasetResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/webhooks-dataset.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockNoWebhooksDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("webhooksDatasetResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        appConfigService = TestBed.inject(AppConfigService);
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
    });

    function resolve(permissions: DatasetPermissionsFragment): Promise<DatasetBasicsFragment | RedirectCommand> {
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(of(permissions));
        return runResolver(webhooksDatasetResolverFn);
    }

    it("should resolve the dataset when the user may view webhooks", async () => {
        const data = await resolve(mockFullPowerDatasetPermissionsFragment);

        expect(data).toEqual(mockDatasetBasicsRootFragment);
    });

    it("should redirect to page not found when the user may not view webhooks", async () => {
        const data = await resolve(mockNoWebhooksDatasetPermissionsFragment);

        expectPageNotFoundRedirect(data);
    });
});
