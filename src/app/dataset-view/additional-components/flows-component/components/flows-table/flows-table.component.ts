import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull } from "./../../../../../common/app.types";
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
import { MatTableDataSource } from "@angular/material/table";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatRadioChange } from "@angular/material/radio";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { CancelFlowArgs, FilterByInitiatorEnum, FlowsTableOptions } from "./flows-table.types";
import { ModalService } from "src/app/components/modal/modal.service";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, tap, map } from "rxjs";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent implements OnInit, OnChanges {
    @Input() public nodes: FlowSummaryDataFragment[];
    @Input() public filterByStatus: MaybeNull<FlowStatus>;
    @Input() public filterByInitiator: FilterByInitiatorEnum;
    @Input() public searchByAccount: MaybeNull<Account>;
    @Input() public searchByDataset: MaybeNull<Dataset>;
    @Input() tableOptions: FlowsTableOptions;
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public filterByInitiatorChange = new EventEmitter<FilterByInitiatorEnum>();
    @Output() public searchByAccountNameChange = new EventEmitter<MaybeNull<Account>>();
    @Output() public searchByDatasetNameChange = new EventEmitter<MaybeNull<Dataset>>();
    @Output() public cancelFlowChange = new EventEmitter<CancelFlowArgs>();
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FilterByInitiatorEnum: typeof FilterByInitiatorEnum = FilterByInitiatorEnum;
    public readonly SEARCH_DATASET_TYPEAHEAD_HEIGHT = 65;
    public readonly TYPEAHEAD_ITEM_HEIGHT = 30;

    public dataSource: MatTableDataSource<FlowSummaryDataFragment> = new MatTableDataSource<FlowSummaryDataFragment>();
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;
    public searchAccountDatasetsLength: number;
    @Input() public accountFlowInitiators: MaybeNull<Account[]> = null;
    @Input() public involvedDatasets: Dataset[];

    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        const nodes: SimpleChange = changes.nodes;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (nodes && nodes.currentValue !== nodes.previousValue) {
            this.dataSource.data = nodes.currentValue as FlowSummaryDataFragment[];
        }
    }

    ngOnInit(): void {
        this.dataSource.data = this.nodes;
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

    public changeFilterByStatus(status: MaybeNull<FlowStatus>): void {
        this.filterByStatusChange.emit(status);
    }

    public onSearchByAccountName(): void {
        this.searchByAccountNameChange.emit(this.searchByAccount);
        this.triggersMatMenu.get(1)?.closeMenu();
    }

    public onSearchByDatasetName(): void {
        this.searchByDatasetNameChange.emit(this.searchByDataset);
        this.triggersMatMenu.get(2)?.closeMenu();
    }

    public changeFilterByInitiator(event: MatRadioChange): void {
        this.filterByInitiatorChange.emit(event.value as FilterByInitiatorEnum);
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

    public accountFormatter(x: Account | string): string {
        return typeof x !== "string" ? x.accountName : x;
    }

    public searchByAccountName: OperatorFunction<string, readonly Account[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                (term === "" || !this.accountFlowInitiators
                    ? []
                    : this.accountFlowInitiators.filter(
                          (initiator) => initiator.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1,
                      )
                ).slice(0, 10),
            ),
        );

    public searchByDatasetName: OperatorFunction<string, readonly Dataset[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                (term === "" || !this.involvedDatasets
                    ? []
                    : this.involvedDatasets.filter(
                          (initiator) => initiator.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
                      )
                ).slice(0, 10),
            ),
            tap((result) => (this.searchAccountDatasetsLength = result.length)),
        );

    public datasetFormatter(x: Dataset | string): string {
        return typeof x !== "string" ? x.name : x;
    }

    public onClickDataset(datasetId: string): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetById(datasetId).owner.accountName,
            datasetName: this.datasetById(datasetId).name,
        });
    }

    public clearSearchByDatasetName(): void {
        this.searchByDataset = null;
        this.searchByDatasetNameChange.emit(this.searchByDataset);
    }

    public get hasDatasetColumn(): boolean {
        return this.tableOptions.displayColumns.includes("dataset");
    }
}
