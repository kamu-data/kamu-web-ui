import { MaybeNull } from "./../../../../../common/app.types";
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
import { FlowSummaryDataFragment, FlowOutcome, FlowStatus, Scalars } from "src/app/api/kamu.graphql.interface";
import moment from "moment";
import AppValues from "src/app/common/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { convertSecondsToHumanReadableFormat } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatRadioChange } from "@angular/material/radio";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { FilterByInitiatorEnum } from "./flows-table.types";

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
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public filterByInitiatorChange = new EventEmitter<FilterByInitiatorEnum>();
    @Output() public searchByAccountNameChange = new EventEmitter<string>();
    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"];
    public readonly INITIATORS: string[] = Object.keys(FilterByInitiatorEnum);
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FlowOutcome: typeof FlowOutcome = FlowOutcome;
    public readonly FilterByInitiatorEnum: typeof FilterByInitiatorEnum = FilterByInitiatorEnum;

    public dataSource: MatTableDataSource<FlowSummaryDataFragment>;
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.nodes);
    }

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]): string {
        const result = convertSecondsToHumanReadableFormat(moment(d2).seconds() - moment(d1).seconds());
        return result ? result : "-";
    }

    public descriptionForDatasetFlow(flow: FlowSummaryDataFragment): string {
        return DataHelpers.descriptionForDatasetFlow(flow);
    }

    public descriptionColumnOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        return DatasetFlowTableHelpers.descriptionColumnTableOptions(element);
    }

    public descriptionDatasetFlowEndOfMessage(element: FlowSummaryDataFragment): string {
        return DatasetFlowTableHelpers.descriptionEndOfMessage(element);
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
}
