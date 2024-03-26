import { ProtocolsService } from "./../../services/protocols.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { Clipboard } from "@angular/cdk/clipboard";
import { Observable } from "rxjs";
import {
    CliProtocolDesc,
    LinkProtocolDesc,
    Protocols,
    RestProtocolDesc,
    FlightSqlDesc,
    JdbcDesc,
    PostgreSqlDesc,
    WebSocketProtocolDesc,
    KafkaProtocolDesc,
    OdataProtocolDesc,
} from "src/app/api/protocols.api";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessPanelComponent extends BaseComponent implements OnInit {
    @Input() datasetBasics: DatasetBasicsFragment;
    public protocols$: Observable<Protocols[]>;

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
        private protocolsService: ProtocolsService,
    ) {
        super();
    }

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
        this.trackSubscription(
            this.protocolsService.getProtocols().subscribe((data: Protocols[]) => {
                const linkProtocol = data.find((item) => item.__typename === "LinkProtocolDesc");
                if (linkProtocol) {
                    this.clipboardReference = (linkProtocol as LinkProtocolDesc).webUrl;
                }

                const cliProtocol = data.find((item) => item.__typename === "CliProtocolDesc");
                if (cliProtocol) {
                    const cliProtocolDesc = cliProtocol as CliProtocolDesc;
                    this.clipboardKamuCliPull = cliProtocolDesc.pullUrl;
                    this.clipboardKamuCliPush = cliProtocolDesc.pushUrl;
                }

                const restProtocol = data.find((item) => item.__typename === "RestProtocolDesc");
                if (restProtocol) {
                    const restProtocolDesc = restProtocol as RestProtocolDesc;
                    this.clipboardRestUrlTail = restProtocolDesc.lastEventsUrl;
                    this.clipboardRestUrlQuery = restProtocolDesc.lastEventsUrl;
                    this.clipboardRestUrlPush = restProtocolDesc.pushUrl;
                }

                const flightSqlProtocol = data.find((item) => item.__typename === "FlightSqlDesc");
                if (flightSqlProtocol) {
                    const flightSqlProtocolDesc = flightSqlProtocol as FlightSqlDesc;
                    this.clipboardFlightSQL = flightSqlProtocolDesc.url;
                }

                const jdbcProtocol = data.find((item) => item.__typename === "JdbcDesc");
                if (jdbcProtocol) {
                    const jdbcProtocolDesc = jdbcProtocol as JdbcDesc;
                    this.clipboardJdbcURL = jdbcProtocolDesc.url;
                }

                const postrgresProtocol = data.find((item) => item.__typename === "PostgreSqlDesc");
                if (postrgresProtocol) {
                    const postrgresProtocolDesc = postrgresProtocol as PostgreSqlDesc;
                    this.clipboardPostgresURL = postrgresProtocolDesc.url;
                }

                const webSocketProtocol = data.find((item) => item.__typename === "WebSocketProtocolDesc");
                if (webSocketProtocol) {
                    const webSocketProtocolDesc = webSocketProtocol as WebSocketProtocolDesc;
                    this.clipboardWebsocketURL = webSocketProtocolDesc.url;
                }

                const kafkaProtocol = data.find((item) => item.__typename === "KafkaProtocolDesc");
                if (kafkaProtocol) {
                    const kafkaProtocolDesc = kafkaProtocol as KafkaProtocolDesc;
                    this.clipboardKafka = kafkaProtocolDesc.url;
                }

                const odataProtocol = data.find((item) => item.__typename === "OdataProtocolDesc");
                if (odataProtocol) {
                    const odataProtocolDesc = odataProtocol as OdataProtocolDesc;
                    this.clipboardODataURLService = odataProtocolDesc.endpointUrl;
                    this.clipboardODataURLCollection = odataProtocolDesc.collectionUrl;
                }
            }),
        );
    }
}
