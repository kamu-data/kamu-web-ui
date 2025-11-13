/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WebhookFlowProcessCardComponent } from "./webhook-flow-process-card.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { FlowProcessEffectiveState, FlowProcessSummary } from "src/app/api/kamu.graphql.interface";
import { mockAccountFlowsAsCardsQuery } from "src/app/api/mock/account.mock";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("WebhookFlowProcessCardComponent", () => {
    let component: WebhookFlowProcessCardComponent;
    let fixture: ComponentFixture<WebhookFlowProcessCardComponent>;
    const MOCK_SUBSCRIPTION_ID = "1233-22334-55555-6666";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WebhookFlowProcessCardComponent, SharedTestModule, HttpClientTestingModule],
            providers: [Apollo],
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

    it("should check to toggle the webhook card state", () => {
        const toggleWebhookCardStateEmitterSpy = spyOn(component.toggleWebhookCardStateEmitter, "emit");
        component.toggleWebhookCardState(
            mockDatasetBasicsRootFragment,
            MOCK_SUBSCRIPTION_ID,
            FlowProcessEffectiveState.Active,
        );
        expect(toggleWebhookCardStateEmitterSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to edit the card state", () => {
        const editWebhookCardEmitterSpy = spyOn(component.editWebhookCardEmitter, "emit");
        component.editWebhookCard(mockDatasetBasicsRootFragment, MOCK_SUBSCRIPTION_ID);
        expect(editWebhookCardEmitterSpy).toHaveBeenCalledTimes(1);
    });
});
