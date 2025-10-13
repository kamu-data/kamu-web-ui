/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import {
    DatasetFlowsTabState,
    FlowsCategoryUnion,
    FlowsSelectionState,
    WebhooksFiltersOptions,
} from "../../flows.helpers";
import { FlowProcessEffectiveState, WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { SubscriptionsTableComponent } from "./components/subscriptions-table/subscriptions-table.component";

@Component({
    selector: "app-flows-associated-channels",
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgClass,
        NgIf,
        NgFor,

        //-----//
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatChipsModule,

        //-----//
        SubscriptionsTableComponent,
    ],
    templateUrl: "./flows-associated-channels.component.html",
    styleUrls: ["./flows-associated-channels.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsAssociatedChannelsComponent {
    @Input({ required: true }) public flowsSelectionState: FlowsSelectionState;
    @Input({ required: true }) public flowConnectionData: DatasetFlowsTabState;
    @Input({ required: true }) public flowsData: DatasetOverviewTabData;
    @Output() public refreshEmitter: EventEmitter<void> = new EventEmitter<void>();

    private navigationService = inject(NavigationService);

    public readonly WEBHOOKS_FILTERS_OPTIONS = WebhooksFiltersOptions;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

    public get showSubprocessesTable(): boolean {
        return this.isWebhookCategoryActive || Boolean(this.flowsSelectionState.webhooksIds.length);
    }

    public get isWebhookCategoryActive(): boolean {
        return this.flowsSelectionState.webhooksCategory === "webhooks";
    }

    public refreshFlow(): void {
        this.refreshEmitter.emit();
    }

    public onSelectionWebhooksChange(event: MatChipListboxChange): void {
        this.flowsSelectionState.flowsCategory = undefined;
        const category = event.value as FlowsCategoryUnion;
        if (category && this.flowsSelectionState.webhookFilterButtons.length) {
            this.flowsSelectionState.webhookFilterButtons = [];
            this.flowsSelectionState.subscriptions = [];
        }
        if (!category) {
            this.flowsSelectionState.webhooksIds = [];
        }

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: category ?? undefined,
        });
        this.refreshFlow();
    }

    public onToggleWebhookFilter(event: MatButtonToggleChange, subprocesses: WebhookFlowSubProcess[]): void {
        const states = event.value as FlowProcessEffectiveState[];
        this.flowsSelectionState.subscriptions = [];
        this.flowsSelectionState.webhooksIds = subprocesses
            .filter((x) => states.includes(x.summary.effectiveState))
            .map((item) => item.id);
        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: this.flowsSelectionState.flowsCategory as FlowsCategoryUnion,
            webhooksState: states.length ? states : undefined,
        });
        this.refreshFlow();
    }

    public removeSelectedWebhook(subscriptionName: string, subprocesses: WebhookFlowSubProcess[]): void {
        const index = this.flowsSelectionState.subscriptions.indexOf(subscriptionName);
        if (index >= 0) {
            this.flowsSelectionState.subscriptions.splice(index, 1);
        }
        const removedId = subprocesses.filter((item) => item.name === subscriptionName)[0].id;
        this.flowsSelectionState.webhooksIds = this.flowsSelectionState.webhooksIds.filter(
            (item) => item !== removedId,
        );

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: this.flowsSelectionState.webhooksIds,
        });
        this.refreshFlow();
    }
}
