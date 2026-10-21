/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetPermissionsFragment, WebhookSubscription } from "@api/kamu.graphql.interface";
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
    const mockRoute = {
        paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_WEBHOOK_ID]: mockWebhookID }),
    } as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<EditWebhooksType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => editWebhookResolverFn(...resolverParameters));

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
    });

    function resolve(
        permissions: DatasetPermissionsFragment = mockFullPowerDatasetPermissionsFragment,
    ): Promise<unknown> {
        spyOnProperty(datasetSubService, "permissionsChanges", "get").and.returnValue(of(permissions));
        return firstValueFrom(executeResolver(mockRoute, mockState) as Observable<unknown>);
    }

    it("should request the webhook from the route and resolve it with the dataset", async () => {
        const mockWebhookSubscription = mockDatasetWebhookByIdQuery.datasets.byId?.webhooks
            .subscription as WebhookSubscription;
        const datasetWebhookSubscriptionByIdSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookSubscriptionById",
        ).and.returnValue(of(mockWebhookSubscription));

        const data = await resolve();

        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledOnceWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            id: mockWebhookID,
        });
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            subscription: mockWebhookSubscription,
        });
    });

    it("should redirect to page not found when the webhook cannot be loaded", async () => {
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById").and.returnValue(
            throwError(() => new Error("fail")),
        );

        const data = await resolve();

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found without loading the webhook when the user may not view webhooks", async () => {
        const datasetWebhookSubscriptionByIdSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookSubscriptionById",
        ).and.stub();

        const data = await resolve(mockNoWebhooksDatasetPermissionsFragment);

        expectPageNotFoundRedirect(data);
        expect(datasetWebhookSubscriptionByIdSpy).not.toHaveBeenCalled();
    });
});
