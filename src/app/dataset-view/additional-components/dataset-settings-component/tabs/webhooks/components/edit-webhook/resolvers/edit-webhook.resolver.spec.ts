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

import { requireValue } from "@common/helpers/app.helpers";
import {
    expectPageNotFoundRedirect,
    routeSnapshot,
    runResolver,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetPermissionsFragment } from "@api/kamu.graphql.interface";
import { mockDatasetWebhookByIdQuery } from "@api/mock/webhooks.mock";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import { editWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/resolvers/edit-webhook.resolver";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockNoWebhooksDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("editWebhookResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;
    let datasetWebhooksService: DatasetWebhooksService;
    const mockWebhookID = "sadasdasdds";
    const route = routeSnapshot({ params: { [ProjectLinks.URL_PARAM_WEBHOOK_ID]: mockWebhookID } });

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
    ): Promise<EditWebhooksType | RedirectCommand> {
        vi.spyOn(datasetSubService, "permissionsChanges", "get").mockReturnValue(of(permissions));
        return runResolver(editWebhookResolverFn, route);
    }

    it("should request the webhook from the route and resolve it with the dataset", async () => {
        const mockWebhookSubscription = requireValue(
            mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription ?? null,
        );
        const datasetWebhookSubscriptionByIdSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById")
            .mockReturnValue(of(mockWebhookSubscription));

        const data = await resolve();

        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledTimes(1);

        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            id: mockWebhookID,
        });
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            subscription: mockWebhookSubscription,
        });
    });

    it("should redirect to page not found when the dataset has no such webhook", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById").mockReturnValue(of(null));

        const data = await resolve();

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found when the webhook cannot be loaded", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById").mockReturnValue(
            throwError(() => new Error("fail")),
        );

        const data = await resolve();

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found without loading the webhook when the user may not view webhooks", async () => {
        const datasetWebhookSubscriptionByIdSpy = stubMethod(datasetWebhooksService, "datasetWebhookSubscriptionById");

        const data = await resolve(mockNoWebhooksDatasetPermissionsFragment);

        expectPageNotFoundRedirect(data);
        expect(datasetWebhookSubscriptionByIdSpy).not.toHaveBeenCalled();
    });
});
