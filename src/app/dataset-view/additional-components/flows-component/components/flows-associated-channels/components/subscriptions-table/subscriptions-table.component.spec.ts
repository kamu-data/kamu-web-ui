/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { SubscriptionsTableComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/components/subscriptions-table/subscriptions-table.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

import { WebhookFlowSubProcess } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";

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
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.subprocesses = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks
            .subprocesses as WebhookFlowSubProcess[];
        component.webhookTableFilters = [];
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
});
