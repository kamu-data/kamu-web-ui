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
    @Input() public showCopyButton = false;
    @Input() public class = "mr-4 hashBlock";
    @Input() public isNavigable = true;

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

    public copyToClipboard(event: Event, text: string): void {
        const displayInlineBlock = "inline-block";
        const displayNone = "none";
        this.clipboard.copy(text);
        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement =
                event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = displayInlineBlock;
                currentElementChildren[1].style.display = displayNone;
                currentElement.classList.remove("clipboard-btn--success");
            }, 2000);

            currentElementChildren[0].style.display = displayNone;
            currentElementChildren[1].style.display = displayInlineBlock;
            currentElement.classList.add("clipboard-btn--success");
        }
    }
}
