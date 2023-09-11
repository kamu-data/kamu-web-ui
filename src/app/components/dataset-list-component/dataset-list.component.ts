import { DatasetInfo } from "../../interface/navigation.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { DatasetBasicsFragment, DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-list",
    templateUrl: "./dataset-list.component.html",
    styleUrls: ["./dataset-list.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetListComponent {
    @Input() public dataSource: DatasetSearchOverviewFragment[];
    @Input() public totalCount = 0;
    @Input() public resultUnitText: string;
    @Input() public hasResultQuantity?: boolean = false;
    @Input() public isClickableRow?: boolean = false;
    @Output() public selectDatasetEmit = new EventEmitter<DatasetInfo>();
    @Input() public sortOptions: {
        value: string;
        label: string;
        active: boolean;
    }[];

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        const datasetBasics: DatasetBasicsFragment = row as DatasetBasicsFragment;
        this.selectDatasetEmit.emit({
            datasetName: datasetBasics.name,
            accountName: datasetBasics.owner.name,
        });
    }
}
