import { DatasetInfo } from "../../interface/navigation.interface";
import { NavigationService } from "../../services/navigation.service";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalService } from "../modal/modal.service";
import { DatasetBasicsFragment, DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-list",
    templateUrl: "./dataset-list.component.html",
    styleUrls: ["./dataset-list.sass"],
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

    constructor(private modalService: ModalService, private navigationService: NavigationService) {}

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        const datasetBasics: DatasetBasicsFragment = row as DatasetBasicsFragment;
        this.selectDatasetEmit.emit({
            datasetName: datasetBasics.name as string,
            accountName: datasetBasics.owner.name,
        });
    }
}
