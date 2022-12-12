import { DatasetInfo } from "./../../interface/navigation.interface";
import { NavigationService } from "./../../services/navigation.service";
import { Component, Input } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.sass"],
})
export class DisplayHashComponent {
    @Input() public value: string;
    @Input() public datasetInfo: DatasetInfo;
    @Input() public showCopyButton?: boolean = false;
    @Input() public class?: string;
    @Input() public isNavigable?: boolean = true;

    constructor(
        private navigationService: NavigationService,
        private clipboard: Clipboard,
    ) {}

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

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement =
                event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, 2000);

            currentElementChildren[0].style.display = "none";
            currentElementChildren[1].style.display = "inline-block";
            currentElement.classList.add("clipboard-btn--success");
        }
    }
}
