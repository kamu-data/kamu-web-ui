/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsAssociatedChannelsComponent } from "./flows-associated-channels.component";
import { Apollo } from "apollo-angular";
import {
    FlowProcessEffectiveState,
    WebhookFlowSubProcess,
    WebhookFlowSubProcessGroup,
} from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SubscriptionsTableComponent } from "./components/subscriptions-table/subscriptions-table.component";
import { provideToastr } from "ngx-toastr";
import { MatChipListboxChange } from "@angular/material/chips";
import { MatButtonToggleChange } from "@angular/material/button-toggle";

describe("FlowsAssociatedChannelsComponent", () => {
    let component: FlowsAssociatedChannelsComponent;
    let fixture: ComponentFixture<FlowsAssociatedChannelsComponent>;

    const subscriptionId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
    const flowProcess: WebhookFlowSubProcess = {
        id: "b8bd7dfe-c517-4c91-b0ba-4f8402fb09fb",
        name: "Website-hook",
        summary: {
            effectiveState: FlowProcessEffectiveState.PausedManual,
            consecutiveFailures: 0,
            lastSuccessAt: "2025-10-12T13:17:26.243504649+00:00",
            lastAttemptAt: "2025-10-12T13:17:26.243504649+00:00",
            lastFailureAt: null,
            nextPlannedAt: null,
            stopPolicy: {
                maxFailures: 5,
                __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
            },
            autoStoppedReason: null,
            autoStoppedAt: null,
            __typename: "FlowProcessSummary",
        },
        __typename: "WebhookFlowSubProcess",
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsAssociatedChannelsComponent, SubscriptionsTableComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(FlowsAssociatedChannelsComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.webhooksData = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes
            .webhooks as WebhookFlowSubProcessGroup;
        component.flowsSelectionState = {
            flowsCategory: undefined,
            webhooksCategory: undefined,
            webhookFilterButtons: [],
            webhooksIds: [],
            subscriptions: [],
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to navigate webhook settings", () => {
        const navigateToWebhookSettingsEmitterSpy = spyOn(component.webhookSettingsClicked, "emit");
        component.navigateToWebhookSettings(subscriptionId);
        expect(navigateToWebhookSettingsEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to subscription", () => {
        const navigateToSubscriptionEmitterSpy = spyOn(component.subcriptionClicked, "emit");
        component.navigateToSubscription(flowProcess);
        expect(navigateToSubscriptionEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to pause subscription", () => {
        const pauseWebhookEmitterSpy = spyOn(component.pauseWebhookClicked, "emit");
        component.pauseWebhook(subscriptionId);
        expect(pauseWebhookEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to resume subscription", () => {
        const resumeWebhookEmitterSpy = spyOn(component.resumeWebhookClicked, "emit");
        component.resumeWebhook(subscriptionId);
        expect(resumeWebhookEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to select 1 state", () => {
        const mockChangeEvent = {
            value: "webhooks",
        };
        const selectionWebhooksEmitterSpy = spyOn(component.selectionWebhooksClicked, "emit");
        component.onSelectionWebhooksChange(mockChangeEvent as MatChipListboxChange);
        expect(selectionWebhooksEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle webhook filter", () => {
        const mockChangeEvent = {
            value: [FlowProcessEffectiveState.Active],
        };
        const toggleWebhookFilterClickedSpy = spyOn(component.toggleWebhookFilterClicked, "emit");
        component.onToggleWebhookFilter(mockChangeEvent as MatButtonToggleChange);
        expect(toggleWebhookFilterClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check remove selected webhook", () => {
        const mockSubscriptionName = "1233-444334-3232e32";
        const removeSelectedWebhookClickedSpy = spyOn(component.removeSelectedWebhookClicked, "emit");
        component.removeSelectedWebhook(mockSubscriptionName);
        expect(removeSelectedWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });
});
