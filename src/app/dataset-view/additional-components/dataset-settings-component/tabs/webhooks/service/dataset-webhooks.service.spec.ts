/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { WebhookSubscriptionDataFragment } from "@api/kamu.graphql.interface";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";
import {
    MOCK_ROTATED_WEBHOOK_SECRET,
    mockDatasetWebhookByIdNotFoundQuery,
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

import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";

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
        const datasetWebhookSubscriptionsSpy = vi
            .spyOn(webhooksApi, "datasetWebhookSubscriptions")
            .mockReturnValue(of(mockDatasetWebhookSubscriptionsQuery));

        service.datasetWebhookSubscriptions(DATASET_ID).subscribe((result: WebhookSubscriptionDataFragment[]) => {
            expect(result.length).toEqual(
                requireValue(mockDatasetWebhookSubscriptionsQuery.datasets.byId?.webhooks.subscriptions.length),
            );
        });
        expect(datasetWebhookSubscriptionsSpy).toHaveBeenCalledTimes(1);
    });

    it("should check dataset webhook subscription by Id", async () => {
        const datasetWebhookSubscriptionByIdSpy = vi
            .spyOn(webhooksApi, "datasetWebhookSubscriptionById")
            .mockReturnValue(of(mockDatasetWebhookByIdQuery));

        const result = await firstValueFrom(
            service.datasetWebhookSubscriptionById({ datasetId: DATASET_ID, id: MOCK_SUBSCRIPTION_ID }),
        );

        expect(result).toEqual(requireValue(mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription));
        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledTimes(1);
        expect(datasetWebhookSubscriptionByIdSpy).toHaveBeenCalledWith({
            datasetId: DATASET_ID,
            id: MOCK_SUBSCRIPTION_ID,
        });
    });

    it("should emit null for a webhook subscription the dataset does not have", async () => {
        vi.spyOn(webhooksApi, "datasetWebhookSubscriptionById").mockReturnValue(
            of(mockDatasetWebhookByIdNotFoundQuery),
        );

        const result = await firstValueFrom(
            service.datasetWebhookSubscriptionById({ datasetId: DATASET_ID, id: MOCK_SUBSCRIPTION_ID }),
        );

        expect(result).toBeNull();
    });

    it("should check create dataset webhook subscription with success", async () => {
        const datasetWebhookCreateSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookCreateSubscription")
            .mockReturnValue(of(mockDatasetWebhookCreateSubscriptionMutation));
        stubMethod(toastrService, "success");

        const result = await firstValueFrom(
            service.datasetWebhookCreateSubscription(DATASET_ID, mockWebhookSubscriptionInput),
        );

        expect(result.ok && result.value.input).toEqual(mockWebhookSubscriptionInput);
        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should report a duplicate label as an error of the label field, without a toast", async () => {
        vi.spyOn(webhooksApi, "datasetWebhookCreateSubscription").mockReturnValue(
            of(mockDatasetWebhookCreateSubscriptionMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        const result = await firstValueFrom(
            service.datasetWebhookCreateSubscription(DATASET_ID, mockWebhookSubscriptionInput),
        );

        expect(result).toEqual({
            ok: false,
            fieldError: { field: "label", message: "A webhook with this label already exists" },
        });
        expect(toastrServiceErrorSpy).not.toHaveBeenCalled();
    });

    it("should check remove dataset webhook subscription with success", () => {
        const datasetWebhookRemoveSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookRemoveSubscription")
            .mockReturnValue(of(mockDatasetWebhookRemoveSubscriptionMutation));

        service.datasetWebhookRemoveSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
        });

        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check rotate secret", () => {
        const datasetWebhookRotateSecretSpy = vi
            .spyOn(webhooksApi, "datasetWebhookRotateSecret")
            .mockReturnValue(of(mockDatasetWebhookRotateSecretMutation));

        service.datasetWebhookRotateSecret(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: string) => {
            expect(result).toEqual(MOCK_ROTATED_WEBHOOK_SECRET);
        });

        expect(datasetWebhookRotateSecretSpy).toHaveBeenCalledTimes(1);
    });

    it("should check remove dataset webhook subscription with error", () => {
        const datasetWebhookRemoveSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookRemoveSubscription")
            .mockReturnValue(of(mockDatasetWebhookRemoveSubscriptionMutationError));
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        service.datasetWebhookRemoveSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause dataset webhook subscription with success", () => {
        const datasetWebhookPauseSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookPauseSubscription")
            .mockReturnValue(of(mockDatasetWebhookPauseSubscriptionMutation));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        service.datasetWebhookPauseSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause dataset webhook subscription with error", () => {
        const datasetWebhookPauseSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookPauseSubscription")
            .mockReturnValue(of(mockDatasetWebhookPauseSubscriptionMutationError));
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        service.datasetWebhookPauseSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resume dataset webhook subscription with success", () => {
        const datasetWebhookResumeSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookResumeSubscription")
            .mockReturnValue(of(mockDatasetWebhookResumeSubscriptionMutation));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        service.datasetWebhookResumeSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check resume dataset webhook subscription with error", () => {
        const datasetWebhookResumeSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookResumeSubscription")
            .mockReturnValue(of(mockDatasetWebhookResumeSubscriptionMutationError));
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        service.datasetWebhookResumeSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check reactivate dataset webhook subscription with success", () => {
        const datasetWebhookReactivateSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookReactivateSubscription")
            .mockReturnValue(of(mockDatasetWebhookReactivateSubscriptionMutation));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        service.datasetWebhookReactivateSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(true);
            expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookReactivateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check reactivate dataset webhook subscription with error", () => {
        const datasetWebhookReactivateSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookReactivateSubscription")
            .mockReturnValue(of(mockDatasetWebhookReactivateSubscriptionMutationError));
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        service.datasetWebhookReactivateSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID).subscribe((result: boolean) => {
            expect(result).toEqual(false);
            expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        });

        expect(datasetWebhookReactivateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check update dataset webhook subscription with success", async () => {
        const datasetWebhookUpdateSubscriptionSpy = vi
            .spyOn(webhooksApi, "datasetWebhookUpdateSubscription")
            .mockReturnValue(of(mockDatasetWebhookUpdateSubscriptionMutation));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        const result = await firstValueFrom(
            service.datasetWebhookUpdateSubscription({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            }),
        );

        expect(result).toEqual({ ok: true, value: true });
        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should toast an update error that belongs to no field", async () => {
        vi.spyOn(webhooksApi, "datasetWebhookUpdateSubscription").mockReturnValue(
            of(mockDatasetWebhookUpdateSubscriptionMutationError),
        );
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        const result = await firstValueFrom(
            service.datasetWebhookUpdateSubscription({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            }),
        );

        expect(result).toEqual({ ok: false, fieldError: null });
        expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Failed");
    });
});
