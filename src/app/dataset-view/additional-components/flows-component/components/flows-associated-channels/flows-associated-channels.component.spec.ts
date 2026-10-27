/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonToggleGroupHarness } from "@angular/material/button-toggle/testing";
import { MatChipListboxHarness } from "@angular/material/chips/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { FlowProcessEffectiveState, WebhookFlowSubProcessDataFragment } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";

import { SubscriptionsTableComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/components/subscriptions-table/subscriptions-table.component";
import { FlowsAssociatedChannelsComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/flows-associated-channels.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("FlowsAssociatedChannelsComponent", () => {
    let component: FlowsAssociatedChannelsComponent;
    let fixture: ComponentFixture<FlowsAssociatedChannelsComponent>;

    const subscriptionId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
    const flowProcess: WebhookFlowSubProcessDataFragment = {
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
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        setComponentInput(
            fixture,
            "webhooksData",
            requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks),
        );
        setComponentInput(fixture, "flowsSelectionState", {
            flowsCategory: undefined,
            webhooksCategory: undefined,
            webhookFilterButtons: [],
            webhooksIds: [],
            subscriptions: [],
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to navigate webhook settings", () => {
        const navigateToWebhookSettingsEmitterSpy = vi
            .spyOn(component.webhookSettingsClicked, "emit")
            .mockImplementation(() => {});
        component.navigateToWebhookSettings(subscriptionId);
        expect(navigateToWebhookSettingsEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to subscription", () => {
        const navigateToSubscriptionEmitterSpy = vi
            .spyOn(component.subcriptionClicked, "emit")
            .mockImplementation(() => {});
        component.navigateToSubscription(flowProcess);
        expect(navigateToSubscriptionEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to pause subscription", () => {
        const pauseWebhookEmitterSpy = vi.spyOn(component.pauseWebhookClicked, "emit").mockImplementation(() => {});
        component.pauseWebhook(subscriptionId);
        expect(pauseWebhookEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to resume subscription", () => {
        const resumeWebhookEmitterSpy = vi.spyOn(component.resumeWebhookClicked, "emit").mockImplementation(() => {});
        component.resumeWebhook(subscriptionId);
        expect(resumeWebhookEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to select 1 state", async () => {
        const selectionWebhooksEmitterSpy = vi
            .spyOn(component.selectionWebhooksClicked, "emit")
            .mockImplementation(() => {});
        const chips = await TestbedHarnessEnvironment.loader(fixture).getHarness(
            MatChipListboxHarness.with({ selector: '[data-test-id="webhooks-category-chips"]' }),
        );
        await chips.selectChips({ text: "Webhooks" });
        expect(selectionWebhooksEmitterSpy).toHaveBeenCalledTimes(1);
        expect(selectionWebhooksEmitterSpy).toHaveBeenCalledWith("webhooks");
    });

    it("should check toggle webhook filter", async () => {
        setComponentInput(fixture, "flowsSelectionState", {
            flowsCategory: undefined,
            webhooksCategory: "webhooks",
            webhookFilterButtons: [],
            webhooksIds: [],
            subscriptions: [],
        });
        const toggleWebhookFilterClickedSpy = vi
            .spyOn(component.toggleWebhookFilterClicked, "emit")
            .mockImplementation(() => {});
        const toggles = await TestbedHarnessEnvironment.loader(fixture).getHarness(
            MatButtonToggleGroupHarness.with({ selector: '[data-test-id="webhook-filter-toggles"]' }),
        );
        const [activeToggle] = await toggles.getToggles({ text: /^Active:/ });
        await activeToggle.check();
        expect(toggleWebhookFilterClickedSpy).toHaveBeenCalledTimes(1);
        expect(toggleWebhookFilterClickedSpy).toHaveBeenCalledWith([FlowProcessEffectiveState.Active]);
    });

    it("should check remove selected webhook", () => {
        const mockSubscriptionName = "1233-444334-3232e32";
        const removeSelectedWebhookClickedSpy = vi
            .spyOn(component.removeSelectedWebhookClicked, "emit")
            .mockImplementation(() => {});
        component.removeSelectedWebhook(mockSubscriptionName);
        expect(removeSelectedWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });
});
