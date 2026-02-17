/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { DatasetFlowProcesses, FlowProcessEffectiveState } from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";

import { FlowsSelectionStateService } from "./flows-selection-state.service";

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
        expect(service.snapshot).toEqual(jasmine.objectContaining({ flowsCategory: "updates" }));
    });

    it("should check #clearFlowsCategory", () => {
        service.setFlowsCategory("updates");
        service.clearFlowsCategory();
        expect(service.snapshot).toEqual(jasmine.objectContaining({ flowsCategory: undefined }));
    });

    it("should check #setWebhooksCategory", () => {
        service.setWebhooksCategory("webhooks");
        expect(service.snapshot).toEqual(jasmine.objectContaining({ webhooksCategory: "webhooks" }));
    });

    it("should check #clearWebhooksCategory", () => {
        service.setWebhooksCategory("webhooks");
        service.clearWebhooksCategory();
        expect(service.snapshot).toEqual(jasmine.objectContaining({ webhooksCategory: undefined }));
    });

    it("should check #setWebhookFilterButtons", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        expect(service.snapshot).toEqual(jasmine.objectContaining({ webhookFilterButtons: processStates }));
    });

    it("should check #toggleWebhookFilterButton if state not exist", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.toggleWebhookFilterButton(FlowProcessEffectiveState.PausedManual);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhookFilterButtons: [...processStates, FlowProcessEffectiveState.PausedManual],
            }),
        );
    });

    it("should check #toggleWebhookFilterButton if state exist", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.toggleWebhookFilterButton(FlowProcessEffectiveState.Active);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhookFilterButtons: [FlowProcessEffectiveState.Failing],
            }),
        );
    });

    it("should check #clearWebhookFilters", () => {
        const processStates = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
        service.setWebhookFilterButtons(processStates);
        service.clearWebhookFilters();
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhookFilterButtons: [],
                webhooksCategory: undefined,
            }),
        );
    });

    it("should check #addSubscription", () => {
        service.addSubscription("subscription-name");
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                subscriptions: ["subscription-name"],
            }),
        );
    });

    it("should check #removeSubscription", () => {
        service.addSubscription("subscription-name");
        service.removeSubscription("subscription-name");
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                subscriptions: [],
            }),
        );
    });

    it("should check #clearSubscription", () => {
        service.addSubscription("subscription-name1");
        service.addSubscription("subscription-name2");
        service.clearSubscription();
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                subscriptions: [],
            }),
        );
    });

    it("should check #addWebhookId", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhooksIds: [mockId],
            }),
        );
    });

    it("should check #removeWebhookId", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        service.removeWebhookId(mockId);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhooksIds: [],
            }),
        );
    });

    it("should check #clearWebhookIds", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        service.clearWebhookIds();
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
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
            jasmine.objectContaining({
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
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        service.initFlowsSelectionState(processes);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhooksIds: [processes.webhooks.subprocesses[0].id],
            }),
        );
    });

    it("should check #initFlowsSelectionState without webhookFilterButtons", () => {
        const mockId = "a9f33c51-aeda-4003-865f-8dc9712619d7";
        service.addWebhookId(mockId);
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        service.initFlowsSelectionState(processes);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                subscriptions: [processes.webhooks.subprocesses[0].name],
            }),
        );
    });

    it("should check #selectSubscription", () => {
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        const mockId = processes.webhooks.subprocesses[0].id;
        const mockName = processes.webhooks.subprocesses[0].name;
        service.setFlowsCategory("updates");
        service.selectSubscription({ id: mockId, name: mockName });

        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
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
            jasmine.objectContaining({
                webhookFilterButtons: [],
                subscriptions: [],
            }),
        );
    });

    it("should check #selectWebhookChip without category", () => {
        service.selectWebhookChip(undefined);
        expect(service.snapshot).toEqual(
            jasmine.objectContaining({
                webhooksIds: [],
                webhooksCategory: undefined,
            }),
        );
    });
});
