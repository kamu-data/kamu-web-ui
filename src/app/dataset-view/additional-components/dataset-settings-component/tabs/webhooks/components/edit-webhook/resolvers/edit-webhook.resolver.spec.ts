/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import { editWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/resolvers/edit-webhook.resolver";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { WebhookSubscription } from "@api/kamu.graphql.interface";
import { mockDatasetWebhookByIdQuery } from "@api/mock/webhooks.mock";

describe("editWebhookResolver", () => {
    let datasetService: DatasetService;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;
    const mockWebhookID = "sadasdasdds";

    const executeResolver: ResolveFn<EditWebhooksType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => editWebhookResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver with success", () => {
        const mockWebhookSubscription = mockDatasetWebhookByIdQuery.datasets.byId?.webhooks
            .subscription as WebhookSubscription;
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById").and.returnValue(of(mockWebhookSubscription));
        const mockRoute = {
            paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_WEBHOOK_ID]: mockWebhookID }),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<EditWebhooksType>;
        result.subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                subscription: mockWebhookSubscription,
            });
        });
    });

    it("should check resolver with error", () => {
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptionById").and.returnValue(
            throwError(() => new Error("fail")),
        );

        const mockRoute = {
            paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_WEBHOOK_ID]: mockWebhookID }),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        const result = executeResolver(mockRoute, mockState) as Observable<EditWebhooksType>;
        result.subscribe({
            complete: () => {
                expect(navigateToPageNotFoundSpy).toHaveBeenCalledTimes(1);
            },
        });
    });
});
