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
import { FlowDataFragment, FlowOutcome, FlowStatus, Scalars } from "src/app/api/kamu.graphql.interface";
import moment from "moment";
import AppValues from "src/app/common/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { convertSecondsToHumanReadableFormat } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatRadioChange } from "@angular/material/radio";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent implements OnInit {
    @Input() public nodes: FlowDataFragment[];
    @Output() public filterByStatusChange = new EventEmitter<MaybeNull<FlowStatus>>();
    @Output() public filterByInitiatorChange = new EventEmitter<string>();
    @Output() public searchByAccountNameChange = new EventEmitter<string>();
    @Input() public filterByStatus: MaybeNull<FlowStatus>;
    @Input() public filterByInitiator: string;
    @Input() public searchByAccountName: string;
    public displayedColumns: string[] = ["description", "information", "creator", "options"];
    public readonly FlowStatus = FlowStatus;
    public readonly FlowOutcome = FlowOutcome;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    public initiators: string[] = ["All", "System", "Account"];
    public dataSource: MatTableDataSource<FlowDataFragment>;
    @ViewChildren(MatMenuTrigger) triggersMatMenu: QueryList<MatMenuTrigger>;

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.nodes);
    }
    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]): string {
        const result = moment(d2).seconds() - moment(d1).seconds();
        return convertSecondsToHumanReadableFormat(result) ? convertSecondsToHumanReadableFormat(result) : "-";
    }

    public descriptionForDatasetFlow(flow: FlowDataFragment): string {
        return DataHelpers.descriptionForDatasetFlow(flow);
    }

    public changeFilterByStatus(status: MaybeNull<FlowStatus>): void {
        this.filterByStatus = status;
        this.filterByStatusChange.emit(this.filterByStatus);
    }

    public onSearchByAccountName(): void {
        this.searchByAccountNameChange.emit(this.searchByAccountName);
        this.triggersMatMenu.get(1)?.closeMenu();
    }

    public changeFilterByInitiator(event: MatRadioChange): void {
        this.filterByInitiatorChange.emit(event.value as string);
    }
}
