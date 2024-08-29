import { ModalService } from "../modal/modal.service";
import { DatasetSearchOverviewFragment } from "../../api/kamu.graphql.interface";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-dataset-list-item",
    templateUrl: "./dataset-list-item.component.html",
    styleUrls: ["./dataset-list-item.component.scss"],
})
export class DatasetListItemComponent {
    @Input({ required: true }) public row: DatasetSearchOverviewFragment;
    @Input() public isClickableRow?: boolean = false;
    @Input({ required: true }) public rowIndex: number;
    @Output() public selectDatasetEmit = new EventEmitter<DatasetSearchOverviewFragment>();

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public selectTopic(topicName: string): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
                title: topicName,
            }),
        );
    }

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.selectDatasetEmit.emit(row);
    }

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }
}
