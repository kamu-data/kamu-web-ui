import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchOverviewDatasetsInterface } from "../../interface/search.interface";
import AppValues from "../../common/app.values";
import { ModalService } from "../modal/modal.service";

@Component({
    selector: "app-repo-list",
    templateUrl: "./repo-list.component.html",
    styleUrls: ["./repo-list.sass"],
})
export class RepoListComponent {
    @Input() public dataSource: SearchOverviewDatasetsInterface[];
    @Input() public totalCount = 0;
    @Input() public resultUnitText: string;
    @Input() public isResultQuantity?: boolean = false;
    @Input() public isClickableRow?: boolean = false;
    @Output() public onSelectDatasetEmit: EventEmitter<{ownerName: string, id: string}> =
        new EventEmitter();
    @Input() public sortOptions: {
        value: string;
        label: string;
        active: boolean;
    }[];

    constructor(private modalService: ModalService) {}

    public momentConverDatetoLocalWithFormat(date: string): string {
        return AppValues.momentConverDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: "DD MMM YYYY",
            isTextDate: true,
        });
    }
    public onSelectDataset(ownerName: string, id: string): void {
        this.onSelectDatasetEmit.emit({ownerName, id: id});
    }

    public searchResultQuantity(
        dataSource: SearchOverviewDatasetsInterface[] = [],
    ): string {
        if (!Array.isArray(dataSource)) {
            return "0";
        }
        return dataSource.length.toString();
    }
    public selectTopic(topicName: string): void {
        this.modalService.warning({
            message: "Feature will be soon",
            yesButtonText: "Ok",
        });
    }
}
