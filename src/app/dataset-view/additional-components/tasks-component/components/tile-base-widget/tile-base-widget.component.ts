import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    public lastRunsCount = 150;
    public arrTiles = Array(1000)
        .fill(0)
        .map((_, index) => index)
        .reverse();
}
