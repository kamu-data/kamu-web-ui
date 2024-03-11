import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull, MaybeUndefined } from "./../../../../../common/app.types";
import { DataHelpers } from "src/app/common/data.helpers";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
} from "@angular/core";
import {
    FlowSummaryDataFragment,
    FlowOutcome,
    FlowStatus,
    Scalars,
    FetchStep,
    FlowStartCondition,
    DatasetBasicsFragment,
} from "src/app/api/kamu.graphql.interface";
import moment from "moment";
import AppValues from "src/app/common/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { convertSecondsToHumanReadableFormat, promiseWithCatch } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatRadioChange } from "@angular/material/radio";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { FilterByInitiatorEnum, TransformDescriptionTableData } from "./flows-table.types";
import { ModalService } from "src/app/components/modal/modal.service";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent implements OnInit {
    @Input() public nodes: FlowSummaryDataFragment[];
    @Input() public filterByStatus: MaybeNull<FlowStatus>;
    @Input() public filterByInitiator: FilterByInitiatorEnum;
    @Input() public searchByAccountName: string;
    @Input() public fetchStep: MaybeUndefined<FetchStep>;
    @Input() public transformData: TransformDescriptionTableData;
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public filterByInitiatorChange = new EventEmitter<FilterByInitiatorEnum>();
    @Output() public searchByAccountNameChange = new EventEmitter<string>();
    @Output() public cancelFlowChange = new EventEmitter<string>();
    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"];
    public readonly INITIATORS: string[] = Object.keys(FilterByInitiatorEnum);
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FlowOutcome: typeof FlowOutcome = FlowOutcome;
    public readonly FilterByInitiatorEnum: typeof FilterByInitiatorEnum = FilterByInitiatorEnum;
    public dataSource: MatTableDataSource<FlowSummaryDataFragment> = new MatTableDataSource<FlowSummaryDataFragment>();
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;

    constructor(private navigationService: NavigationService, private modalService: ModalService) {}

    ngOnInit(): void {
        this.dataSource.data = this.nodes;
    }

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]): string {
        const durationSeconds = Math.round(moment.duration(moment(d2).diff(moment(d1))).asSeconds());
        const result = convertSecondsToHumanReadableFormat(durationSeconds);
        return result ? result : "less than 1 second";
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

    public descriptionDatasetFlowSubMessage(element: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.descriptionSubMessage(element, this.fetchStep, this.transformData);
    }

    public changeFilterByStatus(status: MaybeNull<FlowStatus>): void {
        this.filterByStatusChange.emit(status);
    }

    public onSearchByAccountName(): void {
        this.searchByAccountNameChange.emit(this.searchByAccountName);
        this.triggersMatMenu.get(1)?.closeMenu();
    }

    public changeFilterByInitiator(event: MatRadioChange): void {
        this.filterByInitiatorChange.emit(event.value as FilterByInitiatorEnum);
    }

    public durationBlockVisible(node: FlowSummaryDataFragment): boolean {
        return node.status === FlowStatus.Finished && node.outcome === FlowOutcome.Success;
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

    public navigateToFlowDetaisView(flowId: string): void {
        this.navigationService.navigateToFlowDetails({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            flowId,
        });
    }
}
