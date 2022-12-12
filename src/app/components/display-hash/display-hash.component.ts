import { DatasetInfo } from "./../../interface/navigation.interface";
import { NavigationService } from "./../../services/navigation.service";
import { Component, Input } from "@angular/core";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.sass"],
})
export class DisplayHashComponent {
    @Input() public value: string;
    @Input() public datasetInfo: DatasetInfo;
    @Input() public showCopyIcon?: boolean = false;
    @Input() public class?: string;

    constructor(private navigationService: NavigationService) {}

    public navigateToMetadataBlock(
        accountName: string,
        datasetName: string,
        blockHash: string,
    ): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }
}
