import { NavigationService } from "src/app/services/navigation.service";
import { DataHelpers } from "src/app/common/data.helpers";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
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
    Account,
    Dataset,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { capitalizeString, promiseWithCatch } from "src/app/common/app.helpers";
import { MatLegacyMenuTrigger as MatMenuTrigger } from "@angular/material/legacy-menu";
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
import { ModalService } from "src/app/components/modal/modal.service";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { MaybeNull } from "../../app.types";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent implements OnInit, OnChanges {
    @Input() public nodes: FlowSummaryDataFragment[];
    @Input() public filterByStatus: MaybeNull<FlowStatus>;
    @Input() public onlySystemFlows: boolean;
    @Input() public searchByAccount: Account[] = [];
    @Input() public searchByDataset: Dataset[] = [];
    @Input() tableOptions: FlowsTableOptions;
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public searchByFiltersChange = new EventEmitter<MaybeNull<FlowsTableFiltersOptions>>();
    @Output() public cancelFlowChange = new EventEmitter<CancelFlowArgs>();
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    private readonly FILTERED_ITEMS_COUNT = 10;

    public dataSource: MatTableDataSource<FlowSummaryDataFragment> = new MatTableDataSource<FlowSummaryDataFragment>();
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;
    @Input() public accountFlowInitiators: Account[];
    @Input() public involvedDatasets: Dataset[];

    public readonly FILTER_DATASET_SETTINGS: DropdownSettings = DROPDOWN_DATASET_SETTINGS;
    public readonly FILTER_STATUS_SETTINGS: DropdownSettings = DROPDOWN_STATUS_SETTINGS;
    public filterAccountSettings: DropdownSettings = DROPDOWN_ACCOUNT_SETTINGS;
    public dropdownDatasetList: Dataset[] = [];
    public selectedDatasetItems: Dataset[] = [];
    public dropdownAccountList: Account[] = [];
    public selectedAccountItems: Account[] = [];
    public dropdownStatustList: FilterStatusType[] = [];
    public selectedStatusItems: FilterStatusType[] = [];

    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        const nodes: SimpleChange = changes.nodes;
        if (nodes && nodes.currentValue !== nodes.previousValue) {
            this.dataSource.data = nodes.currentValue as FlowSummaryDataFragment[];
        }
    }

    ngOnInit(): void {
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

    public datasetById(datasetId: string): Dataset {
        const dataset = this.involvedDatasets.find((dataset) => dataset.id === datasetId) as Dataset;
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

    public navigateToFlowDetaisView(flow: FlowSummaryDataFragment, datasetId: string): void {
        this.navigationService.navigateToFlowDetails({
            accountName: this.datasetById(datasetId).owner.accountName,
            datasetName: this.datasetById(datasetId).name,
            flowId: flow.flowId,
        });
    }

    public dynamicImgSrc(status: FlowStatus): string {
        return DatasetFlowDetailsHelpers.dynamicImgSrc(status);
    }

    public onClickDataset(datasetId: string): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetById(datasetId).owner.accountName,
            datasetName: this.datasetById(datasetId).name,
        });
    }

    public onResetFilters(): void {
        this.searchByFiltersChange.emit(null);
        this.filterAccountSettings.disabled = false;
    }

    public get hasDatasetColumn(): boolean {
        return this.tableOptions.displayColumns.includes("dataset");
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
