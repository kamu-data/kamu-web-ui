import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataAccessBaseTabComponent } from "../data-access-base-tab.component";
import { KafkaProtocolDesc, WebSocketProtocolDesc } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-stream-tab",
    templateUrl: "./data-access-stream-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessStreamTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public kafka: KafkaProtocolDesc;
    @Input({ required: true }) public websocket: WebSocketProtocolDesc;
}
