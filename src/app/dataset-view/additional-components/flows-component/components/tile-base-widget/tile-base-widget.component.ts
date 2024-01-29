import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FlowDataFragment, FlowStatus, FlowOutcome } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent implements OnInit {
    @Input() public nodes: FlowDataFragment[];
    public lastRunsCount = 150;
    public readonly FlowStatus = FlowStatus;
    public readonly FlowOutcome = FlowOutcome;

    ngOnInit(): void {
        //this.fillTileBaseWidget(this.nodes);
    }
}
