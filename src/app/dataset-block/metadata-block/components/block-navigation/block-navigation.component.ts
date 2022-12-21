import { DatasetHistoryUpdate } from "./../../../../dataset-view/dataset.subscriptions.interface";
import { SupportedEvents } from "./../event-details/supported.events";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
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
    @Output() onPageChangeEmit = new EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }>();
    public searchHash = "";
    public eventType = this.sortOptions[0];
    public currentPage = 1;

    public get sortOptions() {
        return ["None", ...Object.keys(SupportedEvents)];
    }

    public highligthHash(hash: string, searchHash: string): string {
        return hash.replace(
            searchHash,
            `<span class="bg-warning fs-10">${searchHash}</span>`,
        );
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.onPageChangeEmit.emit(params);
    }

    public refreshSearch(): void {
        this.searchHash = "";
    }
}
