/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";

import {
    DatasetWebhookByIdDocument,
    DatasetWebhookByIdQuery,
    DatasetWebhookCreateSubscriptionDocument,
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionDocument,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookReactivateSubscriptionDocument,
    DatasetWebhookReactivateSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionDocument,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionDocument,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookRotateSecretDocument,
    DatasetWebhookRotateSecretMutation,
    DatasetWebhookSubscriptionsDocument,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionDocument,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookEventTypesDocument,
    WebhookEventTypesQuery,
} from "@api/kamu.graphql.interface";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";
import {
    mockDatasetWebhookByIdQuery,
    mockDatasetWebhookCreateSubscriptionMutation,
    mockDatasetWebhookPauseSubscriptionMutation,
    mockDatasetWebhookReactivateSubscriptionMutation,
    mockDatasetWebhookRemoveSubscriptionMutation,
    mockDatasetWebhookResumeSubscriptionMutation,
    mockDatasetWebhookRotateSecretMutation,
    mockDatasetWebhookSubscriptionsQuery,
    mockDatasetWebhookUpdateSubscriptionMutation,
    mockWebhookEventTypesQuery,
    mockWebhookSubscriptionInput,
} from "@api/mock/webhooks.mock";
import { WebhooksApi } from "@api/webhooks.api";

describe("WebhooksApi", () => {
    let service: WebhooksApi;
    let controller: ApolloTestingController;

    const DATASET_ID = TEST_DATASET_ID;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebhooksApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(WebhooksApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get webhook event types", fakeAsync(() => {
        const subscription$ = service.webhookEventTypes().subscribe((res: WebhookEventTypesQuery) => {
            expect(res.webhooks.eventTypes.length).toEqual(1);
            expect(res.webhooks.eventTypes[0]).toEqual("DATASET.REF.UPDATED");
        });

        const op = controller.expectOne(WebhookEventTypesDocument);

        op.flush({
            data: mockWebhookEventTypesQuery,
        });
        tick();
        expect(subscription$.closed).toEqual(true);
        flush();
    }));

    it("should check get webhooks by id", () => {
        service.datasetWebhookSubscriptions(DATASET_ID).subscribe((res: DatasetWebhookSubscriptionsQuery) => {
            expect(res.datasets.byId?.webhooks.subscriptions.length).toEqual(0);
        });

        const op = controller.expectOne(DatasetWebhookSubscriptionsDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);

        op.flush({
            data: mockDatasetWebhookSubscriptionsQuery,
        });
    });

    it("should check create webhook subscription", () => {
        service
            .datasetWebhookCreateSubscription(DATASET_ID, mockWebhookSubscriptionInput)
            .subscribe((res: DatasetWebhookCreateSubscriptionMutation) => {
                if (
                    res.datasets.byId?.webhooks.createSubscription.__typename ===
                    "CreateWebhookSubscriptionResultSuccess"
                ) {
                    expect(res.datasets.byId?.webhooks.createSubscription.message).toEqual(
                        mockDatasetWebhookCreateSubscriptionMutation.datasets.byId?.webhooks.createSubscription
                            .message as string,
                    );
                }
            });

        const op = controller.expectOne(DatasetWebhookCreateSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.input).toEqual(mockWebhookSubscriptionInput);

        op.flush({
            data: mockDatasetWebhookCreateSubscriptionMutation,
        });
    });

    it("should check to remove the removal of the webhook subscription", () => {
        service
            .datasetWebhookRemoveSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID)
            .subscribe((res: DatasetWebhookRemoveSubscriptionMutation) => {
                expect(res.datasets.byId?.webhooks.subscription?.remove.removed).toEqual(true);
            });

        const op = controller.expectOne(DatasetWebhookRemoveSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookRemoveSubscriptionMutation,
        });
    });

    it("should check the webhook subscription pause", () => {
        service
            .datasetWebhookPauseSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID)
            .subscribe((res: DatasetWebhookPauseSubscriptionMutation) => {
                if (
                    res.datasets.byId?.webhooks.subscription?.pause.__typename ===
                    "PauseWebhookSubscriptionResultSuccess"
                ) {
                    expect(res.datasets.byId?.webhooks.subscription?.pause.paused).toEqual(true);
                }
            });

        const op = controller.expectOne(DatasetWebhookPauseSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookPauseSubscriptionMutation,
        });
    });

    it("should check the webhook subscription resume", () => {
        service
            .datasetWebhookResumeSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID)
            .subscribe((res: DatasetWebhookResumeSubscriptionMutation) => {
                if (
                    res.datasets.byId?.webhooks.subscription?.resume.__typename ===
                    "ResumeWebhookSubscriptionResultSuccess"
                ) {
                    expect(res.datasets.byId?.webhooks.subscription?.resume.resumed).toEqual(true);
                }
            });

        const op = controller.expectOne(DatasetWebhookResumeSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookResumeSubscriptionMutation,
        });
    });

    it("should check the webhook subscription reactivate", () => {
        service
            .datasetWebhookReactivateSubscription(DATASET_ID, MOCK_SUBSCRIPTION_ID)
            .subscribe((res: DatasetWebhookReactivateSubscriptionMutation) => {
                expect(res.datasets.byId?.webhooks.subscription?.reactivate.__typename).toEqual(
                    "ReactivateWebhookSubscriptionResultSuccess",
                );
            });

        const op = controller.expectOne(DatasetWebhookReactivateSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookReactivateSubscriptionMutation,
        });
    });

    it("should check the webhook subscription update", () => {
        service
            .datasetWebhookUpdateSubscription({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            })
            .subscribe((res: DatasetWebhookUpdateSubscriptionMutation) => {
                if (
                    res.datasets.byId?.webhooks.subscription?.update.__typename ===
                    "UpdateWebhookSubscriptionResultSuccess"
                ) {
                    expect(res.datasets.byId?.webhooks.subscription.update.updated).toEqual(true);
                }
            });

        const op = controller.expectOne(DatasetWebhookUpdateSubscriptionDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);
        expect(op.operation.variables.input).toEqual(mockWebhookSubscriptionInput);

        op.flush({
            data: mockDatasetWebhookUpdateSubscriptionMutation,
        });
    });

    it("should check the webhook subscription by Id", () => {
        service
            .datasetWebhookSubscriptionById({
                datasetId: DATASET_ID,
                id: MOCK_SUBSCRIPTION_ID,
            })
            .subscribe((res: DatasetWebhookByIdQuery) => {
                expect(res.datasets.byId?.webhooks.subscription?.id).toEqual(
                    mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription?.id,
                );
            });

        const op = controller.expectOne(DatasetWebhookByIdDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookByIdQuery,
        });
    });

    it("should check to rotate secret for webhook", () => {
        service
            .datasetWebhookRotateSecret(DATASET_ID, MOCK_SUBSCRIPTION_ID)
            .subscribe((res: DatasetWebhookRotateSecretMutation) => {
                expect(res.datasets.byId?.webhooks.subscription?.rotateSecret.newSecret).toEqual(
                    mockDatasetWebhookRotateSecretMutation.datasets.byId?.webhooks.subscription?.rotateSecret.newSecret,
                );
            });

        const op = controller.expectOne(DatasetWebhookRotateSecretDocument);
        expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_SUBSCRIPTION_ID);

        op.flush({
            data: mockDatasetWebhookRotateSecretMutation,
        });
    });
});
