/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { FlowProcessSummary } from "@api/kamu.graphql.interface";
import { mockAccountFlowsAsCardsQuery } from "@api/mock/account.mock";

import { WebhookFlowProcessCardComponent } from "src/app/flow-cards/webhook-flow-process-card/webhook-flow-process-card.component";
import { WebhookFlowProcessCardHarness } from "src/app/flow-cards/webhook-flow-process-card/webhook-flow-process-card.harness";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("WebhookFlowProcessCardComponent", () => {
    let component: WebhookFlowProcessCardComponent;
    let fixture: ComponentFixture<WebhookFlowProcessCardComponent>;
    const MOCK_SUBSCRIPTION_ID = "1233-22334-55555-6666";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WebhookFlowProcessCardComponent, SharedTestModule],
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(WebhookFlowProcessCardComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.subscriptionId = MOCK_SUBSCRIPTION_ID;
        component.summary = mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes.allCards.nodes[0]
            .summary as FlowProcessSummary;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should emit the subscription and its state when the state toggle is clicked", async () => {
        const card = await TestbedHarnessEnvironment.harnessForFixture(fixture, WebhookFlowProcessCardHarness);
        const toggleWebhookCardStateEmitterSpy = spyOn(component.toggleWebhookCardStateEmitter, "emit");

        await card.clickToggleState();

        expect(toggleWebhookCardStateEmitterSpy).toHaveBeenCalledOnceWith({
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
            state: component.summary.effectiveState,
        });
    });

    it("should disable the state toggle while an action is in progress", async () => {
        const card = await TestbedHarnessEnvironment.harnessForFixture(fixture, WebhookFlowProcessCardHarness);
        expect(await card.isToggleStateDisabled()).toBeFalse();

        fixture.componentRef.setInput("actionInProgress", true);

        expect(await card.isToggleStateDisabled()).toBeTrue();
    });
});
