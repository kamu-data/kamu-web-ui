/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetSettingsWebhookTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { datasetSettingsWebhooksResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetSettingsWebhooksResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;
    let datasetWebhooksService: DatasetWebhooksService;

    const executeResolver: ResolveFn<DatasetSettingsWebhookTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsWebhooksResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        appConfigService = TestBed.inject(AppConfigService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOnProperty(datasetSubService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
    });

    function resolve(tab: string): Promise<unknown> {
        const mockRoute = {
            data: {
                [ProjectLinks.URL_PARAM_TAB]: tab,
            },
        } as unknown as ActivatedRouteSnapshot;
        return firstValueFrom(executeResolver(mockRoute, {} as RouterStateSnapshot) as Observable<unknown>);
    }

    it("should resolve the dataset with its webhook subscriptions", async () => {
        const datasetWebhookSubscriptionsSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookSubscriptions",
        ).and.returnValue(of([]));

        const data = await resolve(SettingsTabsEnum.WEBHOOKS);

        expect(datasetWebhookSubscriptionsSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment.id);
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            subscriptions: [],
        });
    });

    it("should redirect to page not found for an unknown tab", async () => {
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(of([]));

        const data = await resolve("wrongTab");

        expectPageNotFoundRedirect(data);
    });

    it("should fail when the webhook subscriptions cannot be loaded", async () => {
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(
            throwError(() => new Error("failed")),
        );

        await expectAsync(resolve(SettingsTabsEnum.WEBHOOKS)).toBeRejectedWithError("failed");
    });
});
