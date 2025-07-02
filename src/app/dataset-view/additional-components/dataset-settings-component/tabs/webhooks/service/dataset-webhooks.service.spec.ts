/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetWebhooksService } from "./dataset-webhooks.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { WebhooksApi } from "src/app/api/webhooks.api";
import {
    mockDatasetWebhookCreateSubscriptionMutation,
    mockDatasetWebhookCreateSubscriptionMutationError,
    mockDatasetWebhookPauseSubscriptionMutation,
    mockDatasetWebhookPauseSubscriptionMutationError,
    mockDatasetWebhookRemoveSubscriptionMutation,
    mockDatasetWebhookRemoveSubscriptionMutationError,
    mockDatasetWebhookResumeSubscriptionMutation,
    mockDatasetWebhookResumeSubscriptionMutationError,
    mockDatasetWebhookSubscriptionsQuery,
    mockDatasetWebhookUpdateSubscriptionMutation,
    mockDatasetWebhookUpdateSubscriptionMutationError,
    mockWebhookSubscriptionInput,
} from "src/app/api/mock/webhooks.mock";
import { of } from "rxjs";
import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import { WebhookSubscription } from "src/app/api/kamu.graphql.interface";
import { CreateWebhookSubscriptionSuccess } from "../create-edit-subscription-modal/create-edit-subscription-modal.model";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("DatasetWebhooksService", () => {
    let service: DatasetWebhooksService;
    let webhooksApi: WebhooksApi;
    let toastrService: ToastrService;

    const DATASET_ID = TEST_DATASET_ID;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DatasetWebhooksService);
        webhooksApi = TestBed.inject(WebhooksApi);
        toastrService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check dataset webhook subscriptions", () => {
        const datasetWebhookSubscriptionsSpy = spyOn(webhooksApi, "datasetWebhookSubscriptions").and.returnValue(
            of(mockDatasetWebhookSubscriptionsQuery),
        );

        service.datasetWebhookSubscriptions(DATASET_ID).subscribe((result: WebhookSubscription[]) => {
            expect(result.length).toEqual(
                mockDatasetWebhookSubscriptionsQuery.datasets.byId?.webhooks.subscriptions.length as number,
            );
        });
        expect(datasetWebhookSubscriptionsSpy).toHaveBeenCalledTimes(1);
    });

    it("should check create dataset webhook subscription with success", () => {
        const datasetWebhookCreateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookCreateSubscription",
        ).and.returnValue(of(mockDatasetWebhookCreateSubscriptionMutation));

        service
            .datasetWebhookCreateSubscription(DATASET_ID, mockWebhookSubscriptionInput)
            .subscribe((result: CreateWebhookSubscriptionSuccess | null) => {
                expect(result?.input).toEqual(mockWebhookSubscriptionInput);
            });

        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check create dataset webhook subscription with error", () => {
        const datasetWebhookCreateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookCreateSubscription",
        ).and.returnValue(of(mockDatasetWebhookCreateSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service
            .datasetWebhookCreateSubscription(DATASET_ID, mockWebhookSubscriptionInput)
            .subscribe((result: CreateWebhookSubscriptionSuccess | null) => {
                expect(result).toEqual(null);
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check remove dataset webhook subscription with success", () => {
        const datasetWebhookRemoveSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookRemoveSubscription",
        ).and.returnValue(of(mockDatasetWebhookRemoveSubscriptionMutation));

        service.datasetWebhookRemoveSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
        });

        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check remove dataset webhook subscription with error", () => {
        const datasetWebhookRemoveSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookRemoveSubscription",
        ).and.returnValue(of(mockDatasetWebhookRemoveSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service.datasetWebhookRemoveSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause dataset webhook subscription with success", () => {
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(mockDatasetWebhookPauseSubscriptionMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        service.datasetWebhookPauseSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause dataset webhook subscription with error", () => {
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(mockDatasetWebhookPauseSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service.datasetWebhookPauseSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resume dataset webhook subscription with success", () => {
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(mockDatasetWebhookResumeSubscriptionMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        service.datasetWebhookResumeSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resume dataset webhook subscription with error", () => {
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(mockDatasetWebhookResumeSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service.datasetWebhookResumeSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check update dataset webhook subscription with success", () => {
        const datasetWebhookUpdateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookUpdateSubscription",
        ).and.returnValue(of(mockDatasetWebhookUpdateSubscriptionMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        service
            .datasetWebhookUpdateSubscription({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
                expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
            });

        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check update dataset webhook subscription with error", () => {
        const datasetWebhookUpdateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookUpdateSubscription",
        ).and.returnValue(of(mockDatasetWebhookUpdateSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service
            .datasetWebhookUpdateSubscription({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });
});
