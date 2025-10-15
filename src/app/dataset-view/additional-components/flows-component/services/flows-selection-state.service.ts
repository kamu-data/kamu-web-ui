/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FlowProcessEffectiveState } from "src/app/api/kamu.graphql.interface";
import { FlowsSelectionState, FlowsSelectedCategory, WebhooksSelectedCategory } from "../flows.helpers";

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

    public hasSubscription(name: string): boolean {
        return this.snapshot.subscriptions.includes(name);
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
