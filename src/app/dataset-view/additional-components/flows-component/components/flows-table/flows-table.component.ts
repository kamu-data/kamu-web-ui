import { DataHelpers } from "src/app/common/data.helpers";
import { ChangeDetectionStrategy, Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FlowDataFragment, FlowOutcome, FlowStatus, Scalars } from "src/app/api/kamu.graphql.interface";
import moment from "moment";
import AppValues from "src/app/common/app.values";
import { MatTableDataSource } from "@angular/material/table";
import { convertSecondsToHumanReadableFormat } from "src/app/common/app.helpers";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent implements OnInit {
    @Input() public nodes: FlowDataFragment[];
    public displayedColumns: string[] = ["description", "information", "creator", "options"];
    public readonly FlowStatus = FlowStatus;
    public readonly FlowOutcome = FlowOutcome;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public filterByStatus = "all";
    public filterByInitiator = "All";
    public searchByAccountName = "";
    public initiators: string[] = ["All", "System", "Account name"];
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

    public get allFlowStatus(): string[] {
        return Object.values(FlowStatus);
    }

    public changeFilterByStatus(status: string): void {
        this.filterByStatus = status;
        if (status !== "all") {
            this.dataSource.filter = status;
        } else {
            this.dataSource = new MatTableDataSource(this.nodes);
        }
    }

    public onSearchCreator(): void {
        this.triggersMatMenu.get(1)?.closeMenu();
    }
}
