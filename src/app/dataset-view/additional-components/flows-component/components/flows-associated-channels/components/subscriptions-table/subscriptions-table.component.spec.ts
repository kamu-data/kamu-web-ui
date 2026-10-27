/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";

import { SubscriptionsTableComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/components/subscriptions-table/subscriptions-table.component";
import { SubscriptionsTableHarness } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/components/subscriptions-table/subscriptions-table.harness";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("SubscriptionsTableComponent", () => {
    let component: SubscriptionsTableComponent;
    let fixture: ComponentFixture<SubscriptionsTableComponent>;
    const MOCK_SUBSCRIPTION_ID = "123-456-234-1323";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SubscriptionsTableComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(SubscriptionsTableComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        setComponentInput(
            fixture,
            "subprocesses",
            requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks.subprocesses),
        );
        setComponentInput(fixture, "webhookTableFilters", []);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #navigateToSubscription", () => {
        const subscriptionClickedSpy = vi.spyOn(component.subscriptionClicked, "emit").mockImplementation(() => {});
        component.navigateToSubscription(component.subprocesses[0]);
        expect(subscriptionClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #pauseWebhook", () => {
        const pauseWebhookClickedSpy = vi.spyOn(component.pauseWebhookClicked, "emit").mockImplementation(() => {});
        component.pauseWebhook(MOCK_SUBSCRIPTION_ID);
        expect(pauseWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #resumeWebhook", () => {
        const resumeWebhookClickedSpy = vi.spyOn(component.resumeWebhookClicked, "emit").mockImplementation(() => {});
        component.resumeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(resumeWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #navigateToWebhookSettings", () => {
        const webhookSettingsClickedSpy = vi
            .spyOn(component.webhookSettingsClicked, "emit")
            .mockImplementation(() => {});
        component.navigateToWebhookSettings(MOCK_SUBSCRIPTION_ID);
        expect(webhookSettingsClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should pause an active subscription and resume any other from its toggle", async () => {
        const table = await TestbedHarnessEnvironment.harnessForFixture(fixture, SubscriptionsTableHarness);
        const pauseWebhookClickedSpy = vi.spyOn(component.pauseWebhookClicked, "emit").mockImplementation(() => {});
        const resumeWebhookClickedSpy = vi.spyOn(component.resumeWebhookClicked, "emit").mockImplementation(() => {});

        for (const subprocess of component.subprocesses) {
            await table.clickToggle(subprocess.id);
        }

        const active = component.subprocesses.filter(
            (s) => s.summary.effectiveState === FlowProcessEffectiveState.Active,
        );
        expect(vi.mocked(pauseWebhookClickedSpy).mock.calls).toEqual(active.map((s) => [s.id]));
        expect(vi.mocked(resumeWebhookClickedSpy).mock.calls.length).toEqual(
            component.subprocesses.length - active.length,
        );
    });

    it("should disable the toggle of a subscription whose action is in progress", async () => {
        const table = await TestbedHarnessEnvironment.harnessForFixture(fixture, SubscriptionsTableHarness);
        const [busy, idle] = component.subprocesses;

        setComponentInput(fixture, "busySubscriptionIds", new Set([busy.id]));

        expect(await table.isToggleDisabled(busy.id)).toBe(true);
        expect(await table.isToggleDisabled(idle.id)).toBe(false);
    });
});
