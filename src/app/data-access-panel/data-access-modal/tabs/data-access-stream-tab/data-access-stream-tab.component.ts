/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { KafkaProtocolDesc, WebSocketProtocolDesc } from "@api/kamu.graphql.interface";

import { CopyToClipboardComponent } from "../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";

@Component({
    selector: "app-data-access-stream-tab",
    templateUrl: "./data-access-stream-tab.component.html",
    styleUrls: ["./data-access-stream-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
    ],
})
export class DataAccessStreamTabComponent {
    @Input({ required: true }) public kafka: KafkaProtocolDesc;
    @Input({ required: true }) public websocket: WebSocketProtocolDesc;
}
