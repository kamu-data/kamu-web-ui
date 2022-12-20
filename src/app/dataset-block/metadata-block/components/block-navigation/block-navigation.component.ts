import { DatasetHistoryUpdate } from "./../../../../dataset-view/dataset.subscriptions.interface";
import { SupportedEvents } from "./../event-details/supported.events";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockNavigationComponent {
    @Input() public datasetHistory: DatasetHistoryUpdate;
    @Input() public currentBlockHash: string;
    @Input() public datasetInfo: DatasetInfo;
    public searchHash = "";
    public eventType = this.sortOptions[0];

    public get sortOptions() {
        return ["None", ...Object.keys(SupportedEvents)];
    }

    public highligthHash(hash: string): string {
        return (
            hash.slice(0, -8) +
            `<span class="highligth fs-10">${hash.slice(-8)}</span>`
        );
    }
}
