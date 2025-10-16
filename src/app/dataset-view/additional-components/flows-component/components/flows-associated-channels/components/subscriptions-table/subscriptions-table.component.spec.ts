/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubscriptionsTableComponent } from "./subscriptions-table.component";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { provideToastr } from "ngx-toastr";

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
