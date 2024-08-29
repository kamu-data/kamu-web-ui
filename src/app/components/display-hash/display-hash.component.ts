import { DatasetInfo } from "../../interface/navigation.interface";
import { NavigationService } from "../../services/navigation.service";
import { Component, inject, Input } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.scss"],
})
export class DisplayHashComponent {
    @Input({ required: true }) public value: string;
    @Input() public navigationTargetDataset?: DatasetInfo;
    @Input() public showCopyButton = false;
    @Input() public class = "mr-1 hashBlock";

    private navigationService = inject(NavigationService);
    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);

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
