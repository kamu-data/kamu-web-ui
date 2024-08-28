import { MaybeUndefined } from "./../../common/app.types";
import { ProtocolsService } from "./../../services/protocols.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetEndpoints } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { Observable } from "rxjs";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessPanelComponent implements OnInit {
    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;
    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    constructor(
        private clipboard: Clipboard,
        private protocolsService: ProtocolsService,
    ) {}

    ngOnInit(): void {
        this.initClipboardHints();
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, AppValues.LONG_DELAY_MS);
            currentElementChildren[0].style.display = "none";
            currentElementChildren[1].style.display = "inline-block";
            currentElement.classList.add("clipboard-btn--success");
        }
    }

    private initClipboardHints(): void {
        this.protocols$ = this.protocolsService.getProtocols({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
