/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataHelpers } from "src/app/common/helpers/data.helpers";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChange,
    SimpleChanges,
    ViewChildren,
} from "@angular/core";
import {
    FlowSummaryDataFragment,
    FlowStatus,
    FlowStartCondition,
    Dataset,
    DatasetListFlowsDataFragment,
    AccountFragment,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { capitalizeString, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import {
    CancelFlowArgs,
    DROPDOWN_ACCOUNT_SETTINGS,
    DROPDOWN_DATASET_SETTINGS,
    DROPDOWN_STATUS_SETTINGS,
    FilterStatusType,
    FlowsTableFiltersOptions,
    FlowsTableOptions,
} from "./flows-table.types";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { MaybeNull } from "../../interface/app.types";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToastrService } from "ngx-toastr";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public nodes: FlowSummaryDataFragment[];
    @Input({ required: true }) public filterByStatus: MaybeNull<FlowStatus>;
    @Input({ required: true }) public onlySystemFlows: boolean;
    @Input({ required: true }) public searchByAccount: AccountFragment[] = [];
    @Input() public searchByDataset: DatasetListFlowsDataFragment[] = [];
    @Input({ required: true }) public tableOptions: FlowsTableOptions;
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public searchByFiltersChange = new EventEmitter<MaybeNull<FlowsTableFiltersOptions>>();
    @Output() public cancelFlowChange = new EventEmitter<CancelFlowArgs>();
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FlowDetailsTabs: typeof FlowDetailsTabs = FlowDetailsTabs;
    private readonly FILTERED_ITEMS_COUNT = 10;

    public dataSource: MatTableDataSource<FlowSummaryDataFragment> = new MatTableDataSource<FlowSummaryDataFragment>();
    @ViewChildren(MatMenuTrigger) private triggersMatMenu: QueryList<MatMenuTrigger>;
    @Input({ required: true }) public accountFlowInitiators: AccountFragment[];
    @Input({ required: true }) public involvedDatasets: DatasetListFlowsDataFragment[];

    public readonly URL_FLOW_DETAILS = ProjectLinks.URL_FLOW_DETAILS;
    public readonly FILTER_DATASET_SETTINGS: DropdownSettings = DROPDOWN_DATASET_SETTINGS;
    public readonly FILTER_STATUS_SETTINGS: DropdownSettings = DROPDOWN_STATUS_SETTINGS;
    public filterAccountSettings: DropdownSettings = DROPDOWN_ACCOUNT_SETTINGS;
    public dropdownDatasetList: DatasetListFlowsDataFragment[] = [];
    public selectedDatasetItems: DatasetListFlowsDataFragment[] = [];
    public dropdownAccountList: AccountFragment[] = [];
    public selectedAccountItems: AccountFragment[] = [];
    public dropdownStatustList: FilterStatusType[] = [];
    public selectedStatusItems: FilterStatusType[] = [];

    private modalService = inject(ModalService);
    private datasetFlowsService = inject(DatasetFlowsService);
    private toastrService = inject(ToastrService);

    public ngOnChanges(changes: SimpleChanges): void {
        const nodes: SimpleChange = changes.nodes;
        if (nodes && nodes.currentValue !== nodes.previousValue) {
            this.dataSource.data = nodes.currentValue as FlowSummaryDataFragment[];
        }
    }

    public ngOnInit(): void {
        this.dataSource.data = this.nodes;
        this.initializeFilters();
    }

    public durationTask(d1: string, d2: string): string {
        return DataHelpers.durationTask(d1, d2);
    }

    public flowTypeDescription(flow: FlowSummaryDataFragment): string {
        return DataHelpers.flowTypeDescription(flow);
    }

    public descriptionColumnOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        return DatasetFlowTableHelpers.descriptionColumnTableOptions(element);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.descriptionEndOfMessage(element);
    }

    public descriptionDatasetFlowSubMessage(element: FlowSummaryDataFragment, datasetId: string): string {
        return DatasetFlowTableHelpers.descriptionSubMessage(element, this.involvedDatasets ?? [], datasetId);
    }

    public onSearch(): void {
        this.triggersMatMenu.get(1)?.closeMenu();
        this.triggersMatMenu.get(2)?.closeMenu();
        this.searchByFiltersChange.emit({
            accounts: this.selectedAccountItems,
            datasets: this.selectedDatasetItems,
            status:
                !this.selectedStatusItems.length || this.selectedStatusItems[0].status === "All"
                    ? null
                    : (this.selectedStatusItems[0].status.toUpperCase() as FlowStatus),
            onlySystemFlows: this.onlySystemFlows,
        });
    }

    public durationBlockVisible(node: FlowSummaryDataFragment): boolean {
        return node.status === FlowStatus.Finished && node.outcome?.__typename === "FlowSuccessResult";
    }

    public durationBlockText(node: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.durationBlockText(node);
    }

    public tooltipText(node: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.tooltipText(node);
    }

    public waitingForBlockVisible(node: FlowSummaryDataFragment): boolean {
        return [FlowStatus.Waiting].includes(node.status);
    }

    public waitingBlockText(startCondition: MaybeNull<FlowStartCondition>): string {
        return DatasetFlowTableHelpers.waitingBlockText(startCondition);
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
        return DatasetFlowTableHelpers.retriesBlockText(node.status, node.tasks.length, node.retryPolicy.maxAttempts);
    }

    public datasetById(datasetId: string): Dataset {
        const dataset = (this.involvedDatasets as Dataset[]).find((dataset) => dataset.id === datasetId) as Dataset;
        return dataset;
    }

    public cancelFlow(flowId: string, datasetId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Cancel flow",
                message: "Do you want to cancel the flow?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.cancelFlowChange.emit({ flowId, datasetId });
                    }
                },
            }),
        );
    }

    public flowStatusAnimationSrc(status: FlowStatus): string {
        return DatasetFlowDetailsHelpers.flowStatusAnimationSrc(status);
    }

    public onResetFilters(): void {
        this.searchByFiltersChange.emit(null);
        this.filterAccountSettings.disabled = false;
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
                        if (node.description.__typename === "FlowDescriptionDatasetPollingIngest") {
                            this.datasetFlowsService
                                .datasetTriggerIngestFlow({
                                    datasetId: node.description.datasetId,
                                    ingestConfigInput: {
                                        fetchUncacheable: true,
                                    },
                                })
                                .pipe(takeUntilDestroyed(this.destroyRef))
                                .subscribe((result: boolean) => {
                                    if (result) {
                                        this.toastrService.success("Force update started");
                                    }
                                });
                        } else {
                            throw new Error("Configuration snapshot is undefined");
                        }
                    }
                },
            }),
        );
    }

    private initializeFilters(): void {
        this.dropdownDatasetList = this.involvedDatasets.slice(0, this.FILTERED_ITEMS_COUNT);
        this.selectedDatasetItems = this.searchByDataset;

        this.dropdownAccountList = this.accountFlowInitiators.slice(0, this.FILTERED_ITEMS_COUNT);
        this.selectedAccountItems = this.searchByAccount;

        this.dropdownStatustList = Object.entries(FlowStatus).map(([key]) => {
            return { id: key, status: key };
        });
        this.dropdownStatustList = [{ id: "All", status: "All" }, ...this.dropdownStatustList];
        this.selectedStatusItems = this.filterByStatus
            ? [{ id: capitalizeString(this.filterByStatus), status: capitalizeString(this.filterByStatus) }]
            : [];
        this.filterAccountSettings.disabled = this.onlySystemFlows;
    }
}
