import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Component, inject, Input } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastrService } from "ngx-toastr";
import ProjectLinks from "src/app/project-links";

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
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;

    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastr.success("Copied");
    }
}
