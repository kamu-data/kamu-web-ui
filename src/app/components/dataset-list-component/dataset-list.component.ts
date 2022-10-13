import { relativeTime } from "src/app/common/data.helpers";
import { DatasetInfo } from "../../interface/navigation.interface";
import { NavigationService } from "../../services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { ModalService } from "../modal/modal.service";
import {
    DatasetBasicsFragment,
    DatasetSearchOverviewFragment,
} from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";

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

    constructor(
        private modalService: ModalService,
        public navigationService: NavigationService,
    ) {}

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        const datasetBasics: DatasetBasicsFragment =
            row as DatasetBasicsFragment;
        this.selectDatasetEmit.emit({
            datasetName: datasetBasics.name as string,
            accountName: datasetBasics.owner.name,
        });
    }

    public getRelativeTime(time: string): string {
        return relativeTime(time);
    }

    public selectTopic(topicName: string): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
                title: topicName,
            }),
        );
    }
}
