import { DatasetHistoryUpdate } from "../../../../dataset-view/dataset.subscriptions.interface";
import { SupportedEvents } from "../event-details/supported.events";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeNull } from "src/app/common/app.types";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockNavigationComponent {
    @Input() public datasetHistory: MaybeNull<DatasetHistoryUpdate>;
    @Input() public currentBlockHash: string;
    @Input() public datasetInfo: DatasetInfo;
    @Output() public onPageChangeEmit = new EventEmitter<number>();
    public searchHash = "";
    public currentPage = 1;

    public dropdownList = Object.entries(SupportedEvents).map(([key]) => {
        return { id: key, value: key };
    });
    public eventTypeFiltersSelected: { id: string; value: string }[] = [];
    public readonly DROPDOWN_SETTINGS: DropdownSettings = {
        singleSelection: false,
        text: "Select event type",
        labelKey: "value",
        enableCheckAll: false,
        enableSearchFilter: false,
    };

    public get eventTypeFilters(): string[] {
        return this.eventTypeFiltersSelected.map((item) => item.value);
    }

    public highlightHash(hash: string, searchHash: string): string {
        return hash.replace(searchHash, `<span class="bg-warning fs-10">${searchHash}</span>`);
    }

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }

    public refreshSearch(): void {
        this.searchHash = "";
    }
}
