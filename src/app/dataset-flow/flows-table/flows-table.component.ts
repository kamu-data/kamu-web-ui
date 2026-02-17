/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass, NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterLink } from "@angular/router";

import {
    AccountFragment,
    Dataset,
    DatasetBasicsFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowSummaryDataWithTriggerFragment,
} from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { SafeHtmlPipe } from "@common/pipes/safe-html.pipe";
import AppValues from "@common/values/app.values";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import { ToastrService } from "ngx-toastr";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import {
    CancelFlowArgs,
    DROPDOWN_DATASET_SETTINGS,
    DROPDOWN_STATUS_SETTINGS,
    FlowsTableFiltersOptions,
    FlowsTableOptions,
} from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { MaybeNull } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        NgClass,
        RouterLink,
        FormsModule,
        //-----//
        AngularMultiSelectModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatDividerModule,
        //-----//
        SafeHtmlPipe,
    ],
})
export class FlowsTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public nodes: FlowSummaryDataWithTriggerFragment[];
    @Input({ required: true }) public filterByStatus: MaybeNull<FlowStatus[]>;
    @Input({ required: true }) public onlySystemFlows: boolean;
    @Input({ required: true }) public searchByAccount: AccountFragment[] = [];
    @Input() public searchByDataset: DatasetBasicsFragment[] = [];
    @Input({ required: true }) public tableOptions: FlowsTableOptions;
    @Input({ required: true }) public accountFlowInitiators: AccountFragment[];
    @Input({ required: true }) public involvedDatasets: DatasetBasicsFragment[];
    @Input({ required: true }) public totalCount: number;

    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public searchByFiltersChange = new EventEmitter<MaybeNull<FlowsTableFiltersOptions>>();
    @Output() public abortFlowChange = new EventEmitter<CancelFlowArgs>();

    @ViewChild(MatTable) private table: MaybeNull<MatTable<FlowSummaryDataWithTriggerFragment>> = null;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;

    public readonly URL_FLOW_DETAILS = ProjectLinks.URL_FLOW_DETAILS;
    public readonly FILTER_DATASET_SETTINGS: DropdownSettings = DROPDOWN_DATASET_SETTINGS;
    public readonly FILTER_STATUS_SETTINGS: DropdownSettings = DROPDOWN_STATUS_SETTINGS;

    private readonly modalService = inject(ModalService);
    private readonly datasetFlowsService = inject(DatasetFlowsService);
    private readonly toastrService = inject(ToastrService);

    public dataSource: MatTableDataSource<FlowSummaryDataWithTriggerFragment> =
        new MatTableDataSource<FlowSummaryDataWithTriggerFragment>();

    public ngOnInit(): void {
        this.dataSource.data = this.nodes;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const nodesChange: SimpleChange = changes.nodes;
        if (!nodesChange || !nodesChange.currentValue) return;

        const newNodes: FlowSummaryDataWithTriggerFragment[] =
            nodesChange.currentValue as FlowSummaryDataWithTriggerFragment[];
        const existingData = this.dataSource.data;

        // Build lookup map from current data
        const existingById = new Map<string, FlowSummaryDataWithTriggerFragment>();
        for (const row of existingData) {
            existingById.set(row.flowId, row);
        }

        // Efficient in-place update & reordering
        for (let i = 0; i < newNodes.length; i++) {
            const newNode = newNodes[i];
            const existing = existingById.get(newNode.flowId);
            if (existing) {
                // Shallow object patch, but reference preserved
                Object.assign(existing, newNode);
                existingData[i] = existing;
            } else {
                existingData[i] = newNode;
            }
        }

        // Trim any excess rows from the previous array
        existingData.length = newNodes.length;

        // Trigger re-render
        this.table?.renderRows();
    }

    public flowTypeDescription(flow: FlowSummaryDataWithTriggerFragment): string {
        return FlowTableHelpers.flowTypeDescription(flow as FlowSummaryDataFragment);
    }

    public descriptionColumnOptions(element: FlowSummaryDataWithTriggerFragment): { icon: string; class: string } {
        return FlowTableHelpers.descriptionColumnTableOptions(element as FlowSummaryDataFragment);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataWithTriggerFragment): string {
        return FlowTableHelpers.descriptionEndOfMessage(element as FlowSummaryDataFragment);
    }

    public descriptionDatasetFlowSubMessage(element: FlowSummaryDataWithTriggerFragment): string {
        return FlowTableHelpers.descriptionSubMessage(element as FlowSummaryDataFragment);
    }

    public durationBlockVisible(node: FlowSummaryDataFragment): boolean {
        return node.status === FlowStatus.Finished;
    }

    public durationBlockText(node: FlowSummaryDataFragment): string {
        return FlowTableHelpers.durationBlockText(node);
    }

    public durationTimingText(node: FlowSummaryDataFragment): string {
        return FlowTableHelpers.runDurationTimingText(node);
    }

    public tooltipText(node: FlowSummaryDataFragment): string {
        return FlowTableHelpers.tooltipText(node);
    }

    public waitingForBlockVisible(node: FlowSummaryDataFragment): boolean {
        return [FlowStatus.Waiting].includes(node.status);
    }

    public waitingBlockText(startCondition: MaybeNull<FlowStartCondition>): string {
        return FlowTableHelpers.waitingBlockText(startCondition);
    }

    public retriesBlockVisible(node: FlowSummaryDataFragment): boolean {
        // We want to show the retries block if:
        // 1. The flow is currently retrying.
        // 2. The flow has failed, and there were multiple retry attempts.
        return (
            node.status === FlowStatus.Retrying ||
            (node.status === FlowStatus.Finished &&
                (node.retryPolicy?.maxAttempts || 0) > 0 &&
                node.outcome?.__typename === "FlowFailedError")
        );
    }

    public retriesBlockText(node: FlowSummaryDataFragment): string {
        if (!node.retryPolicy) {
            throw new Error("Retry policy is undefined, but expected");
        }
        return FlowTableHelpers.retriesBlockText(node.status, node.taskIds.length, node.retryPolicy.maxAttempts);
    }

    public datasetById(datasetId: string): Dataset {
        const dataset = (this.involvedDatasets as Dataset[]).find((dataset) => dataset.id === datasetId) as Dataset;
        return dataset;
    }

    public abortFlow(flowElement: FlowSummaryDataWithTriggerFragment): void {
        let message = "Do you want to abort this flow?";

        // Warn about pausing schedule triggers, if they are still on
        if (flowElement.relatedTrigger) {
            if (!flowElement.relatedTrigger.paused && flowElement.relatedTrigger.schedule) {
                message += " This will also pause the scheduled updates.";
            }
        }

        promiseWithCatch(
            this.modalService.error({
                title: "Abort flow",
                message,
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.abortFlowChange.emit({
                            flowId: flowElement.flowId,
                            datasetId: flowElement.datasetId ?? null,
                        });
                    }
                },
            }),
        );
    }

    public flowStatusAnimationSrc(status: FlowStatus): string {
        return DatasetFlowDetailsHelpers.flowStatusAnimationSrc(status);
    }

    public get hasDatasetColumn(): boolean {
        return this.tableOptions.displayColumns.includes("dataset");
    }

    public showForceUpdateLink(node: FlowSummaryDataFragment): boolean {
        return (
            node.description.__typename === "FlowDescriptionDatasetPollingIngest" &&
            node.description.ingestResult?.__typename === "FlowDescriptionUpdateResultUpToDate" &&
            node.description.ingestResult.uncacheable &&
            ((node.configSnapshot?.__typename === "FlowConfigRuleIngest" && !node.configSnapshot.fetchUncacheable) ||
                !node.configSnapshot)
        );
    }

    public onForceUpdate(node: FlowSummaryDataFragment): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Run force update",
                message: "Do you want to run a force update?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        if (node.description.__typename === "FlowDescriptionDatasetPollingIngest" && node.datasetId) {
                            this.datasetFlowsService
                                .datasetTriggerIngestFlow({
                                    datasetId: node.datasetId,
                                    ingestConfigInput: {
                                        fetchUncacheable: true,
                                        fetchNextIteration: false,
                                    },
                                })
                                .pipe(takeUntilDestroyed(this.destroyRef))
                                .subscribe((result: boolean) => {
                                    if (result) {
                                        this.toastrService.success("Force update started");
                                    }
                                });
                        } else {
                            throw new Error("Configuration snapshot is undefined or datasetId is missing");
                        }
                    }
                },
            }),
        );
    }

    public trackByFlowId(index: number, item: FlowSummaryDataFragment): string {
        return item.flowId;
    }
}
