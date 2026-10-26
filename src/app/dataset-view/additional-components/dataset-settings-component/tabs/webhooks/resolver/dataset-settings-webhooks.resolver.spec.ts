/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect, runResolver, stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { DatasetSettingsWebhookTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { datasetSettingsWebhooksResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockNoWebhooksDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("datasetSettingsWebhooksResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;
    let datasetWebhooksService: DatasetWebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        appConfigService = TestBed.inject(AppConfigService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        vi.spyOn(appConfigService, "featureFlags", "get").mockReturnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
    });

    function resolve(
        permissions: DatasetPermissionsFragment = mockFullPowerDatasetPermissionsFragment,
    ): Promise<DatasetSettingsWebhookTabData | RedirectCommand> {
        vi.spyOn(datasetSubService, "permissionsChanges", "get").mockReturnValue(of(permissions));
        return runResolver(datasetSettingsWebhooksResolverFn);
    }

    it("should resolve the dataset with its webhook subscriptions", async () => {
        const datasetWebhookSubscriptionsSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookSubscriptions")
            .mockReturnValue(of([]));

        const data = await resolve();

        expect(datasetWebhookSubscriptionsSpy).toHaveBeenCalledTimes(1);

        expect(datasetWebhookSubscriptionsSpy).toHaveBeenCalledWith(mockDatasetBasicsRootFragment.id);
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            subscriptions: [],
        });
    });

    it("should redirect to page not found without loading subscriptions when the user may not view webhooks", async () => {
        const datasetWebhookSubscriptionsSpy = stubMethod(datasetWebhooksService, "datasetWebhookSubscriptions");

        const data = await resolve(mockNoWebhooksDatasetPermissionsFragment);

        expectPageNotFoundRedirect(data);
        expect(datasetWebhookSubscriptionsSpy).not.toHaveBeenCalled();
    });

    it("should fail when the webhook subscriptions cannot be loaded", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").mockReturnValue(
            throwError(() => new Error("failed")),
        );

        await expect(resolve()).rejects.toThrowError("failed");
    });
});
