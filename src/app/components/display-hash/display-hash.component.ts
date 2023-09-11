import { DatasetInfo } from "../../interface/navigation.interface";
import { NavigationService } from "../../services/navigation.service";
import { Component, Input } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.scss"],
})
export class DisplayHashComponent {
    @Input() public value: string;
    @Input() public navigationTargetDataset?: DatasetInfo;
    @Input() public showCopyButton = false;
    @Input() public class = "mr-1 hashBlock";

    constructor(
        private navigationService: NavigationService,
        private clipboard: Clipboard,
        private toastr: ToastrService,
    ) {}

    public navigateToMetadataBlock(accountName: string, datasetName: string, blockHash: string): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastr.success("Copied");
    }
}
