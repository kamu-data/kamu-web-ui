/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { WebhookSubscription } from "@api/kamu.graphql.interface";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";
import {
    mockDatasetWebhookByIdQuery,
    mockDatasetWebhookCreateSubscriptionMutation,
    mockDatasetWebhookCreateSubscriptionMutationError,
    mockDatasetWebhookPauseSubscriptionMutation,
    mockDatasetWebhookPauseSubscriptionMutationError,
    mockDatasetWebhookReactivateSubscriptionMutation,
    mockDatasetWebhookReactivateSubscriptionMutationError,
    mockDatasetWebhookRemoveSubscriptionMutation,
    mockDatasetWebhookRemoveSubscriptionMutationError,
    mockDatasetWebhookResumeSubscriptionMutation,
    mockDatasetWebhookResumeSubscriptionMutationError,
    mockDatasetWebhookRotateSecretMutation,
    mockDatasetWebhookSubscriptionsQuery,
    mockDatasetWebhookUpdateSubscriptionMutation,
    mockDatasetWebhookUpdateSubscriptionMutationError,
    mockWebhookSubscriptionInput,
} from "@api/mock/webhooks.mock";
import { WebhooksApi } from "@api/webhooks.api";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { CreateWebhookSubscriptionSuccess } from "../dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "./dataset-webhooks.service";

describe("DatasetWebhooksService", () => {
    let service: DatasetWebhooksService;
    let webhooksApi: WebhooksApi;
    let toastrService: ToastrService;

    const DATASET_ID = TEST_DATASET_ID;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
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

    it("should check dataset webhook subscription by Id", () => {
        const datasetWebhookSubscriptionByIdSpy = spyOn(webhooksApi, "datasetWebhookSubscriptionById").and.returnValue(
            of(mockDatasetWebhookByIdQuery),
        );

        service
            .datasetWebhookSubscriptionById({ datasetId: DATASET_ID, id: MOCK_SUBSCRIPTION_ID })
            .subscribe((result: WebhookSubscription) => {
                expect(result.id).toEqual(
                    mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription?.id as string,
                );
            });
        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledTimes(1);
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

    it("should check rotate secret", () => {
        const datasetWebhookRotateSecretSpy = spyOn(webhooksApi, "datasetWebhookRotateSecret").and.returnValue(
            of(mockDatasetWebhookRotateSecretMutation),
        );

        service.datasetWebhookRotateSecret(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: string) => {
            expect(result).toEqual(
                mockDatasetWebhookRotateSecretMutation.datasets.byId?.webhooks.subscription?.rotateSecret
                    .newSecret as string,
            );
        });

        expect(datasetWebhookRotateSecretSpy).toHaveBeenCalledTimes(1);
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

    it("should check reactivate dataset webhook subscription with success", () => {
        const datasetWebhookReactivateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookReactivateSubscription",
        ).and.returnValue(of(mockDatasetWebhookReactivateSubscriptionMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        service.datasetWebhookReactivateSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookReactivateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check reactivate dataset webhook subscription with error", () => {
        const datasetWebhookReactivateSubscriptionSpy = spyOn(
            webhooksApi,
            "datasetWebhookReactivateSubscription",
        ).and.returnValue(of(mockDatasetWebhookReactivateSubscriptionMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        service.datasetWebhookReactivateSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookReactivateSubscriptionSpy).toHaveBeenCalledTimes(1);
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
