import AppValues from "src/app/common/app.values";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetKind, Seed } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "app-seed-event",
    templateUrl: "./seed-event.component.html",
    styleUrls: ["./seed-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedEventComponent {
    @Input() public event: Seed;

    constructor(private clipboard: Clipboard) {}

    public datasetKind(kind: DatasetKind): string {
        return DataHelpers.datasetKind2String(kind);
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
            }, AppValues.LONG_DELAY_MS);

            currentElementChildren[0].style.display = displayNone;
            currentElementChildren[1].style.display = displayInlineBlock;
            currentElement.classList.add("clipboard-btn--success");
        }
    }
}
