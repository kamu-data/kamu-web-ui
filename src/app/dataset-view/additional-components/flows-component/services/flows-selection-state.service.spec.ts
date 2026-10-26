/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { requireValue } from "@common/helpers/app.helpers";
import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";

import { FlowsSelectionStateService } from "src/app/dataset-view/additional-components/flows-component/services/flows-selection-state.service";

describe("FlowsSelectionStateService", () => {
    let service: FlowsSelectionStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FlowsSelectionStateService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #setFlowsCategory", () => {
        service.setFlowsCategory("updates");
        expect(service.snapshot).toEqual(expect.objectContaining({ flowsCategory: "updates" }));
    });

    it("should check #clearFlowsCategory", () => {
        service.setFlowsCategory("updates");
        service.clearFlowsCategory();
        expect(service.snapshot).toEqual(expect.objectContaining({ flowsCategory: undefined }));
    });

    it("should check #setWebhooksCategory", () => {
        service.setWebhooksCategory("webhooks");
        expect(service.snapshot).toEqual(expect.objectContaining({ webhooksCategory: "webhooks" }));
    });

    it("should check #clearWebhooksCategory", () => {
        service.setWebhooksCategory("webhooks");
        service.clearWebhooksCategory();
        expect(service.snapshot).toEqual(expect.objectContaining({ webhooksCategory: undefined }));
    });

    it("should check #setWebhookFilterButtons", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        expect(service.snapshot).toEqual(expect.objectContaining({ webhookFilterButtons: processStates }));
    });

    it("should check #toggleWebhookFilterButton if state not exist", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.toggleWebhookFilterButton(FlowProcessEffectiveState.PausedManual);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhookFilterButtons: [...processStates, FlowProcessEffectiveState.PausedManual],
            }),
        );
    });

    it("should check #toggleWebhookFilterButton if state exist", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.toggleWebhookFilterButton(FlowProcessEffectiveState.Active);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhookFilterButtons: [FlowProcessEffectiveState.Failing],
            }),
        );
    });

    it("should check #clearWebhookFilters", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.clearWebhookFilters();
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhookFilterButtons: [],
                webhooksCategory: undefined,
            }),
        );
    });

    it("should check #addSubscription", () => {
        service.addSubscription("subscription-name");
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                subscriptions: ["subscription-name"],
            }),
        );
    });

    it("should check #removeSubscription", () => {
        service.addSubscription("subscription-name");
        service.removeSubscription("subscription-name");
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                subscriptions: [],
            }),
        );
    });

    it("should check #clearSubscription", () => {
        service.addSubscription("subscription-name1");
        service.addSubscription("subscription-name2");
        service.clearSubscription();
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                subscriptions: [],
            }),
        );
    });

    it("should check #addWebhookId", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [mockId],
            }),
        );
    });

    it("should check #removeWebhookId", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        service.removeWebhookId(mockId);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [],
            }),
        );
    });

    it("should check #clearWebhookIds", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        service.clearWebhookIds();
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [],
            }),
        );
    });

    it("should check #reset", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.reset();
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [],
                flowsCategory: "all",
                webhooksCategory: undefined,
                webhookFilterButtons: [],
                subscriptions: [],
            }),
        );
    });

    it("should check #initFlowsSelectionState with webhookFilterButtons", () => {
        service.setWebhookFilterButtons([FlowProcessEffectiveState.Active]);
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes ?? null);
        service.initFlowsSelectionState(processes);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [processes.webhooks.subprocesses[0].id],
            }),
        );
    });

    it("should check #initFlowsSelectionState without webhookFilterButtons", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes ?? null);
        service.initFlowsSelectionState(processes);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                subscriptions: [processes.webhooks.subprocesses[0].name],
            }),
        );
    });

    it("should check #selectSubscription", () => {
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes ?? null);
        const mockId = processes.webhooks.subprocesses[0].id;
        const mockName = processes.webhooks.subprocesses[0].name;
        service.setFlowsCategory("updates");
        service.selectSubscription({ id: mockId, name: mockName });

        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [mockId],
                flowsCategory: undefined,
                webhookFilterButtons: [],
                subscriptions: [mockName],
            }),
        );
    });

    it("should check #selectWebhookChip with category", () => {
        service.setWebhookFilterButtons([FlowProcessEffectiveState.Active]);
        service.selectWebhookChip("webhooks");
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhookFilterButtons: [],
                subscriptions: [],
            }),
        );
    });

    it("should check #selectWebhookChip without category", () => {
        service.selectWebhookChip(undefined);
        expect(service.snapshot).toEqual(
            expect.objectContaining({
                webhooksIds: [],
                webhooksCategory: undefined,
            }),
        );
    });
});
