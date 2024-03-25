import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { AppConfigService } from "src/app/app-config.service";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessPanelComponent implements OnInit {
    @Input() datasetBasics: DatasetBasicsFragment;
    public clipboardKamuCliPull = "";
    public clipboardKamuCliPush = "";
    public clipboardReference = "";
    public clipboardKafka = "";
    public clipboardRestUrlTail = "";
    public clipboardRestUrlQuery = "";
    public clipboardRestUrlPush = "";
    public clipboardFlightSQL = "";
    public clipboardJdbcURL = "";
    public clipboardPostgresURL = "";
    public clipboardODataURLService = "";
    public clipboardODataURLCollection = "";
    public clipboardWebsocketURL = "";

    constructor(
        private clipboard: Clipboard,
        private appConfigService: AppConfigService,
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
        this.clipboardReference = `https://${location.host}/${this.datasetBasics.alias}`;
        this.clipboardKamuCliPull = `kamu pull kamu.dev/${this.datasetBasics.alias}`;
        this.clipboardKamuCliPush = `kamu push kamu.dev/${this.datasetBasics.alias}`;
        this.clipboardKafka = `- coming soon -`;
        this.clipboardRestUrlTail = `${this.appConfigService.apiServerGqlUrl}/${this.datasetBasics.alias}/tail?limit=10`;
        this.clipboardRestUrlQuery = `${this.appConfigService.apiServerGqlUrl}/query?query=select%201`;
        this.clipboardRestUrlPush = `${this.appConfigService.apiServerGqlUrl}/${this.datasetBasics.alias}/push`;
        this.clipboardFlightSQL = `datafusion+flightsql://node.demo.kamu.dev:50050`;
        this.clipboardJdbcURL = `jdbc:arrow-flight-sql://node.demo.kamu.dev:50050`;
        this.clipboardPostgresURL = `- coming soon -`;
        this.clipboardODataURLService = `${this.appConfigService.apiServerGqlUrl}/odata/${this.datasetBasics.owner.accountName}`;
        this.clipboardODataURLCollection = `${this.appConfigService.apiServerGqlUrl}/odata/${this.datasetBasics.alias}`;
        this.clipboardWebsocketURL = `- coming soon -`;
    }
}
