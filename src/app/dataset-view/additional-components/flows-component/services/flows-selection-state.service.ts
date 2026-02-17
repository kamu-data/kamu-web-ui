/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import {
    FlowsSelectedCategory,
    FlowsSelectionState,
    WebhooksSelectedCategory,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

import { DatasetFlowProcesses, FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

@Injectable({ providedIn: "root" })
export class FlowsSelectionStateService {
    private readonly state$ = new BehaviorSubject<FlowsSelectionState>({
        webhooksIds: [],
        flowsCategory: "all",
        webhooksCategory: undefined,
        webhookFilterButtons: [],
        subscriptions: [],
    });

    public readonly selectionState$ = this.state$.asObservable();

    public get snapshot(): FlowsSelectionState {
        return this.state$.value;
    }

    private patch(partial: Partial<FlowsSelectionState>): void {
        this.state$.next({ ...this.state$.value, ...partial });
    }

    public setFlowsCategory(cat: FlowsSelectedCategory): void {
        this.patch({
            flowsCategory: cat,
        });
    }

    public clearFlowsCategory(): void {
        this.patch({ flowsCategory: undefined });
    }

    public setWebhooksCategory(cat: WebhooksSelectedCategory): void {
        this.patch({
            webhooksCategory: cat,
        });
    }

    public clearWebhooksCategory(): void {
        this.patch({ webhooksCategory: undefined });
    }

    // ---------- Webhook filter buttons (chips) ----------
    public setWebhookFilterButtons(buttons: FlowProcessEffectiveState[]): void {
        this.patch({ webhookFilterButtons: [...buttons] });
    }

    public toggleWebhookFilterButton(button: FlowProcessEffectiveState): void {
        const { webhookFilterButtons } = this.snapshot;
        const exists = webhookFilterButtons.includes(button);
        const updated = exists ? webhookFilterButtons.filter((b) => b !== button) : [...webhookFilterButtons, button];
        this.patch({ webhookFilterButtons: updated });
    }

    public clearWebhookFilters(): void {
        this.patch({ webhookFilterButtons: [], webhooksCategory: undefined });
    }

    public addSubscription(name: string): void {
        const { subscriptions } = this.snapshot;
        if (!subscriptions.includes(name)) {
            this.patch({ subscriptions: [...subscriptions, name] });
        }
    }

    public removeSubscription(name: string): void {
        const { subscriptions } = this.snapshot;
        if (subscriptions.includes(name)) {
            this.patch({ subscriptions: subscriptions.filter((n) => n !== name) });
        }
    }

    public clearSubscription(): void {
        this.patch({ subscriptions: [] });
    }

    public addWebhookId(id: string): void {
        const { webhooksIds } = this.snapshot;
        if (!webhooksIds.includes(id)) {
            this.patch({ webhooksIds: [...webhooksIds, id] });
        }
    }

    public removeWebhookId(id: string): void {
        const { webhooksIds } = this.snapshot;
        if (webhooksIds.includes(id)) {
            this.patch({ webhooksIds: webhooksIds.filter((x) => x !== id) });
        }
    }

    public clearWebhookIds(): void {
        this.patch({ webhooksIds: [] });
    }

    public initFlowsSelectionState(flowProcesses: DatasetFlowProcesses): void {
        const { webhooksIds, webhookFilterButtons } = this.snapshot;
        if (webhookFilterButtons.length) {
            const ids = flowProcesses.webhooks.subprocesses
                .filter((item) => webhookFilterButtons.includes(item.summary.effectiveState))
                .map((x) => x.id);
            ids.forEach((id) => this.addWebhookId(id));
        }

        if (webhooksIds.length && !webhookFilterButtons.length) {
            const subprocessesNames = flowProcesses.webhooks.subprocesses
                .filter((item) => webhooksIds.includes(item.id))
                .map((x) => x.name);
            subprocessesNames.forEach((item) => this.addSubscription(item));
        }
    }

    public selectSubscription(process: { name: string; id: string }): void {
        const { webhooksCategory, flowsCategory } = this.snapshot;

        if (webhooksCategory || flowsCategory) {
            this.clearWebhookIds();
        }

        this.addSubscription(process.name);
        this.addWebhookId(process.id);

        this.clearFlowsCategory();
        this.clearWebhookFilters();
    }

    public selectWebhookChip(category: MaybeUndefined<WebhooksSelectedCategory>): void {
        this.clearFlowsCategory();
        const { webhookFilterButtons } = this.snapshot;
        if (category && webhookFilterButtons.length) {
            this.clearWebhookFilters();
            this.clearSubscription();
        }
        if (!category) {
            this.clearWebhookIds();
            this.clearWebhooksCategory();
        }
    }

    public reset(): void {
        this.state$.next({
            webhooksIds: [],
            flowsCategory: "all",
            webhooksCategory: undefined,
            webhookFilterButtons: [],
            subscriptions: [],
        });
    }
}
