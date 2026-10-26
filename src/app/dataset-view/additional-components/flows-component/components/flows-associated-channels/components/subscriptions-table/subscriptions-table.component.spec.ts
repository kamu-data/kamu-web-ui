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
        fixture.componentRef.setInput("datasetBasics", mockDatasetBasicsRootFragment);
        fixture.componentRef.setInput(
            "subprocesses",
            mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks.subprocesses,
        );
        fixture.componentRef.setInput("webhookTableFilters", []);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #navigateToSubscription", () => {
        const subscriptionClickedSpy = spyOn(component.subscriptionClicked, "emit");
        component.navigateToSubscription(component.subprocesses[0]);
        expect(subscriptionClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #pauseWebhook", () => {
        const pauseWebhookClickedSpy = spyOn(component.pauseWebhookClicked, "emit");
        component.pauseWebhook(MOCK_SUBSCRIPTION_ID);
        expect(pauseWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #resumeWebhook", () => {
        const resumeWebhookClickedSpy = spyOn(component.resumeWebhookClicked, "emit");
        component.resumeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(resumeWebhookClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #navigateToWebhookSettings", () => {
        const webhookSettingsClickedSpy = spyOn(component.webhookSettingsClicked, "emit");
        component.navigateToWebhookSettings(MOCK_SUBSCRIPTION_ID);
        expect(webhookSettingsClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should pause an active subscription and resume any other from its toggle", async () => {
        const table = await TestbedHarnessEnvironment.harnessForFixture(fixture, SubscriptionsTableHarness);
        const pauseWebhookClickedSpy = spyOn(component.pauseWebhookClicked, "emit");
        const resumeWebhookClickedSpy = spyOn(component.resumeWebhookClicked, "emit");

        for (const subprocess of component.subprocesses) {
            await table.clickToggle(subprocess.id);
        }

        const active = component.subprocesses.filter(
            (s) => s.summary.effectiveState === FlowProcessEffectiveState.Active,
        );
        expect(pauseWebhookClickedSpy.calls.allArgs()).toEqual(active.map((s) => [s.id]));
        expect(resumeWebhookClickedSpy.calls.count()).toEqual(component.subprocesses.length - active.length);
    });

    it("should disable the toggle of a subscription whose action is in progress", async () => {
        const table = await TestbedHarnessEnvironment.harnessForFixture(fixture, SubscriptionsTableHarness);
        const [busy, idle] = component.subprocesses;

        fixture.componentRef.setInput("busySubscriptionIds", new Set([busy.id]));

        expect(await table.isToggleDisabled(busy.id)).toBeTrue();
        expect(await table.isToggleDisabled(idle.id)).toBeFalse();
    });
});
