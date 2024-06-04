import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull, MaybeUndefined } from "./../../../../../common/app.types";
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
    FetchStep,
    FlowStartCondition,
    DatasetBasicsFragment,
    Account,
    Dataset,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatRadioChange } from "@angular/material/radio";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { FilterByInitiatorEnum, TransformDescriptionTableData } from "./flows-table.types";
import { ModalService } from "src/app/components/modal/modal.service";
import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import { DatasetFlowsService } from "../../services/dataset-flows.service";
import {
    OperatorFunction,
    Observable,
    debounceTime,
    distinctUntilChanged,
    tap,
    switchMap,
    map,
    catchError,
    of,
} from "rxjs";
import { AccountService } from "src/app/services/account.service";

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
    @Input() public fetchStep: MaybeUndefined<FetchStep>;
    @Input() public transformData: TransformDescriptionTableData;
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public accountView: boolean = false;
    @Input() public accountName?: string;
    @Input() public accountDatasets?: Dataset[];
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public filterByInitiatorChange = new EventEmitter<FilterByInitiatorEnum>();
    @Output() public searchByAccountNameChange = new EventEmitter<MaybeNull<Account>>();
    @Output() public searchByDatasetNameChange = new EventEmitter<MaybeNull<Dataset>>();
    @Output() public cancelFlowChange = new EventEmitter<string>();
    public DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"];
    public INITIATORS: string[] = Object.keys(FilterByInitiatorEnum);
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly DEFAULT_FLOW_INITIATOR = AppValues.DEFAULT_FLOW_INITIATOR;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FilterByInitiatorEnum: typeof FilterByInitiatorEnum = FilterByInitiatorEnum;
    public readonly SEARCH_DATASET_TYPEAHEAD_HEIGHT = 65;
    public readonly TYPEAHEAD_ITEM_HEIGHT = 30;

    public dataSource: MatTableDataSource<FlowSummaryDataFragment> = new MatTableDataSource<FlowSummaryDataFragment>();
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;
    public searchingAccount: boolean = false;
    public searchingDataset: boolean = false;
    public searchAccountDatasetsLength: number;

    constructor(
        private navigationService: NavigationService,
        private modalService: ModalService,
        private flowService: DatasetFlowsService,
        private accountService: AccountService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        const nodes: SimpleChange = changes.nodes;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (nodes && nodes.currentValue !== nodes.previousValue) {
            this.dataSource.data = nodes.currentValue as FlowSummaryDataFragment[];
        }
    }

    ngOnInit(): void {
        if (this.accountView) {
            this.DISPLAY_COLUMNS.splice(3, 0, "dataset");
            this.INITIATORS = [FilterByInitiatorEnum.All, FilterByInitiatorEnum.System];
        }
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

    public descriptionDatasetFlowSubMessage(element: FlowSummaryDataFragment, dataset: Dataset): string {
        if (this.accountView) {
            this.fetchStep = dataset.metadata.currentPollingSource?.fetch;
            const currentTransform = dataset.metadata.currentTransform;
            this.transformData = {
                numInputs: currentTransform?.inputs.length ?? 0,
                engine: currentTransform?.transform.engine ?? "",
            };
        }
        return DatasetFlowTableHelpers.descriptionSubMessage(element, this.fetchStep, this.transformData);
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

    public datasetByIdForAccount(datasetId: string): Dataset {
        const dataset = this.accountDatasets?.find((dataset) => dataset.id === datasetId) as Dataset;
        return dataset;
    }

    public cancelFlow(flowId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Cancel flow",
                message: "Do you want to cancel the flow?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.cancelFlowChange.emit(flowId);
                    }
                },
            }),
        );
    }

    public navigateToFlowDetaisView(flow: FlowSummaryDataFragment, datasetId: string): void {
        this.navigationService.navigateToFlowDetails({
            accountName: this.accountView && this.accountName ? this.accountName : this.datasetBasics.owner.accountName,
            datasetName: this.accountView ? this.datasetByIdForAccount(datasetId).name : this.datasetBasics.name,
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
            tap(() => (this.searchingAccount = true)),
            switchMap((term) =>
                this.flowService.flowsInitiators(this.datasetBasics.id).pipe(
                    map((owners: Account[]) =>
                        owners
                            ?.filter((owner: Account) => owner.accountName.toLowerCase().indexOf(term) > -1)
                            .slice(0, 10)
                            .sort((a, b) => {
                                if (a.accountName < b.accountName) return -1;
                                if (a.accountName > b.accountName) return 1;
                                return 0;
                            }),
                    ),
                    catchError(() => {
                        return of([]);
                    }),
                ),
            ),
            tap(() => (this.searchingAccount = false)),
        );

    public searchByDatasetName: OperatorFunction<string, readonly Dataset[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.searchingDataset = true)),
            switchMap((term) =>
                this.accountService.getDatasetsWithFlows(this.accountName ?? "").pipe(
                    map((datasets) =>
                        datasets
                            ?.filter((dataset) => dataset.name.toLowerCase().indexOf(term) > -1)
                            .slice(0, 10)
                            .sort((a, b) => {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }),
                    ),
                    tap((result) => (this.searchAccountDatasetsLength = result.length)),
                    catchError(() => {
                        return of([]);
                    }),
                ),
            ),
            tap(() => (this.searchingDataset = false)),
        );

    public datasetFormatter(x: Dataset | string): string {
        return typeof x !== "string" ? x.name : x;
    }

    public onClickDataset(datasetId: string): void {
        if (this.accountName) {
            this.navigationService.navigateToDatasetView({
                accountName: this.accountName,
                datasetName: this.datasetByIdForAccount(datasetId).name,
            });
        }
    }

    public clearSearchByDatasetName(): void {
        this.searchByDataset = null;
        this.searchByDatasetNameChange.emit(this.searchByDataset);
    }
}
