import { relativeTime } from "src/app/common/data.helpers";
import { DatasetInfo } from "./../../interface/navigation.interface";
import { NavigationService } from "./../../services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { ModalService } from "../modal/modal.service";
import { Dataset } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-repo-list",
    templateUrl: "./repo-list.component.html",
    styleUrls: ["./repo-list.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoListComponent {
    @Input() public dataSource: Dataset[];
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

    public onSelectDataset(row: Dataset): void {
        this.selectDatasetEmit.emit({
            datasetName: row.name as string,
            accountName: row.owner.name,
        });
    }

    public getRelativeTime(time: string): string {
        return relativeTime(time);
    }

    public searchResultQuantity(dataSource: Dataset[] = []): string {
        if (!Array.isArray(dataSource)) {
            return "0";
        }
        return dataSource.length.toString();
    }
    public selectTopic(topicName: string): void {
        this.modalService.warning({
            message: "Feature coming soon",
            yesButtonText: "Ok",
            title: topicName,
        });
    }
}
